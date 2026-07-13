// ============================================================================
// Общий разбор ASSETS_PROMPT_PACK.md для генераторов ассетов.
// Используется и OpenAI-, и Higgsfield-провайдером — один источник правды.
// ============================================================================
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

// --- СТРОГИЙ ФОТОРЕАЛИЗМ (общее требование для всех кадров) ------------------
export const PHOTOREAL =
  'Реальная документальная фотография живых людей, снято на профессиональную ' +
  'зеркальную камеру, естественная кожа и ткань, фотореализм; СТРОГО без ' +
  'иллюстраций, без мультяшности, без рисунка, без 3D-рендера, без CGI, без стилизации.';

// [STYLE] — арена
export const ARENA =
  'on-brand SANGER: черно-красная форма с белым вордмарком «SANGER», ' +
  'кинематографический тёмный свет арены с красными акцентами, премиальная ' +
  'спортивная фотография, высокий контраст, резкая детализация, без текстовых ' +
  'оверлеев и графики. ' +
  PHOTOREAL;

// [STUDIO] — товарные/студийные кадры
export const STUDIO =
  'чистый белый студийный фон, мягкий студийный свет, премиальная предметная/' +
  'портретная съёмка, без текстовых оверлеев и графики. ' +
  PHOTOREAL;

// Раскрываем `dir/name-1..5.png` и списки через запятую; сокращённый путь без
// каталога наследует каталог предыдущего.
export function expandPaths(raw) {
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

// Парсер промпт-пака: возвращает [{ path, prompt }]
export function parsePack(md) {
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

// Загрузка ASSETS_PROMPT_PACK.md + применение фильтров --only.
export async function loadItems(root, only = '') {
  const md = await readFile(join(root, 'ASSETS_PROMPT_PACK.md'), 'utf8');
  let items = parsePack(md);
  if (only) items = items.filter((it) => it.path.includes(only));
  return items;
}

// Чтение значения из process.env либо из .env.local (KEY=value).
export async function readEnv(root, name) {
  if (process.env[name]) return process.env[name].trim();
  const envFile = join(root, '.env.local');
  if (existsSync(envFile)) {
    const txt = await readFile(envFile, 'utf8');
    const m = txt.match(new RegExp(`^\\s*${name}\\s*=\\s*"?([^"\\n\\r]+)"?`, 'm'));
    if (m) return m[1].trim();
  }
  return '';
}

// Простой парсер CLI-флагов, общий для генераторов.
export function parseArgs(argv) {
  const flag = (name) => argv.includes(name);
  const opt = (name, def) => {
    const i = argv.indexOf(name);
    return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
  };
  return {
    ONLY: opt('--only', ''),
    FORCE: flag('--force'),
    DRY: flag('--dry'),
    LIMIT: Number(opt('--limit', '0')) || 0,
  };
}
