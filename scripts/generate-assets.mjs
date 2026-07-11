#!/usr/bin/env node
// ============================================================================
// SANGER · генератор фото-ассетов (OpenAI Images → public/assets)
// ----------------------------------------------------------------------------
// Читает ASSETS_PROMPT_PACK.md, разворачивает строки промптов (включая диапазоны
// вида `hockey-1..5.png`), подставляет единый style-суффикс (ARENA / STUDIO) и
// генерирует фотографии в public/assets/<путь>.
//
// Запуск:  OPENAI_API_KEY=sk-... npm run assets
//          (ключ также читается из .env.local)
// Без ключа скрипт печатает план и выходит — сборка от этого не зависит.
//
// Флаги:
//   --only <substr>   генерировать только пути, содержащие подстроку
//   --force           перегенерировать уже существующие файлы
//   --dry             только показать план, ничего не запрашивать
//   --limit <n>       ограничить число генераций (для проверки ключа)
// ============================================================================

import { readFile, writeFile, mkdir, access } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const PACK = join(ROOT, 'ASSETS_PROMPT_PACK.md');
const OUT_DIR = join(ROOT, 'public', 'assets');

// --- СТРОГИЙ ФОТОРЕАЛИЗМ (общее требование для всех кадров) ------------------
const PHOTOREAL =
  'Реальная документальная фотография живых людей, снято на профессиональную ' +
  'зеркальную камеру, естественная кожа и ткань, фотореализм; СТРОГО без ' +
  'иллюстраций, без мультяшности, без рисунка, без 3D-рендера, без CGI, без стилизации.';

// [STYLE] — арена
const ARENA =
  'on-brand SANGER: черно-красная форма с белым вордмарком «SANGER», ' +
  'кинематографический тёмный свет арены с красными акцентами, премиальная ' +
  'спортивная фотография, высокий контраст, резкая детализация, без текстовых ' +
  'оверлеев и графики. ' +
  PHOTOREAL;

// [STUDIO] — товарные/студийные кадры
const STUDIO =
  'чистый белый студийный фон, мягкий студийный свет, премиальная предметная/' +
  'портретная съёмка, без текстовых оверлеев и графики. ' +
  PHOTOREAL;

// ----------------------------------------------------------------------------
// Разбор аргументов
// ----------------------------------------------------------------------------
const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const opt = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const ONLY = opt('--only', '');
const FORCE = flag('--force');
const DRY = flag('--dry');
const LIMIT = Number(opt('--limit', '0')) || 0;

// ----------------------------------------------------------------------------
// Ключ OpenAI: env → .env.local
// ----------------------------------------------------------------------------
async function readKey() {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY.trim();
  const envFile = join(ROOT, '.env.local');
  if (existsSync(envFile)) {
    const txt = await readFile(envFile, 'utf8');
    const m = txt.match(/^\s*OPENAI_API_KEY\s*=\s*"?([^"\n\r]+)"?/m);
    if (m) return m[1].trim();
  }
  return '';
}

// ----------------------------------------------------------------------------
// Парсер промпт-пака: возвращает [{ path, prompt }]
// ----------------------------------------------------------------------------
function expandPaths(raw) {
  // раскрываем `dir/name-1..5.png` и списки через запятую;
  // сокращённый второй путь без каталога наследует каталог предыдущего.
  const out = [];
  let lastDir = '';
  const push = (p) => {
    if (!p.includes('/') && lastDir) p = `${lastDir}/${p}`;
    const slash = p.lastIndexOf('/');
    if (slash >= 0) lastDir = p.slice(0, slash);
    out.push(p);
  };

  for (let chunk of raw.split(',')) {
    chunk = chunk.trim().replace(/`/g, '').trim();
    if (!chunk) continue;

    // диапазон вида prefix-1..5.png
    const range = chunk.match(/^(.*?)(\d+)\.\.(\d+)(\.\w+)$/);
    if (range) {
      const [, prefix, a, b, ext] = range;
      for (let i = Number(a); i <= Number(b); i++) push(`${prefix}${i}${ext}`);
      continue;
    }
    push(chunk);
  }
  return out;
}

function parsePack(md) {
  const items = [];
  const seen = new Set();
  const lineRe = /^\s*[\d–\-]+\.\s+(.*?)\s*\[(STYLE|STUDIO)(?:\/[^\]]*)?\]\s*(.*?)→\s*(.+)$/;

  for (const line of md.split(/\r?\n/)) {
    const m = line.match(lineRe);
    if (!m) continue;
    const [, desc, styleTag, extra, pathsRaw] = m;
    const style = styleTag === 'STUDIO' ? STUDIO : ARENA;
    const base = `${desc.trim()} ${extra.trim()}`.trim().replace(/\s+/g, ' ');

    const paths = expandPaths(pathsRaw)
      // убираем маркеры вроде «✅ уже сгенерирован»
      .map((p) => p.split(/\s/)[0])
      .filter((p) => /\.\w+$/.test(p));

    for (const p of paths) {
      if (seen.has(p)) continue;
      seen.add(p);
      items.push({ path: p, prompt: `${base}. ${style}` });
    }
  }
  return items;
}

// ----------------------------------------------------------------------------
// Генерация через OpenAI Images API (gpt-image-1)
// ----------------------------------------------------------------------------
async function generate(key, prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1024x1024',
      n: 1,
    }),
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`OpenAI ${res.status}: ${body.slice(0, 300)}`);
  }
  const json = await res.json();
  const b64 = json?.data?.[0]?.b64_json;
  if (!b64) throw new Error('Пустой ответ image API');
  return Buffer.from(b64, 'base64');
}

async function fileExists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

// ----------------------------------------------------------------------------
// main
// ----------------------------------------------------------------------------
async function main() {
  const md = await readFile(PACK, 'utf8');
  let items = parsePack(md);
  if (ONLY) items = items.filter((it) => it.path.includes(ONLY));

  console.log(`SANGER assets · найдено ${items.length} кадров в промпт-паке.`);

  const key = await readKey();
  if (!key || DRY) {
    if (!key) console.log('\n⚠️  OPENAI_API_KEY не найден — генерация пропущена.');
    console.log('План генерации:');
    for (const it of items.slice(0, LIMIT || items.length)) {
      console.log(`  • public/assets/${it.path}`);
    }
    console.log('\nЗадать ключ: OPENAI_API_KEY=sk-... npm run assets');
    return;
  }

  let done = 0;
  let skipped = 0;
  let failed = 0;
  for (const it of items) {
    if (LIMIT && done >= LIMIT) break;
    const outPath = join(OUT_DIR, it.path);
    if (!FORCE && (await fileExists(outPath))) {
      skipped++;
      continue;
    }
    try {
      await mkdir(dirname(outPath), { recursive: true });
      const buf = await generate(key, it.prompt);
      await writeFile(outPath, buf);
      done++;
      console.log(`✓ ${it.path}`);
    } catch (e) {
      failed++;
      console.error(`✗ ${it.path} — ${e.message}`);
    }
  }
  console.log(`\nГотово: сгенерировано ${done}, пропущено ${skipped}, ошибок ${failed}.`);
  if (done > 0) {
    console.log(
      'Дальше: для появившихся фото включите available:true в lib/studioAssets.ts ' +
        'и/или замените <Placeholder/> на next/image с тем же путём.',
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
