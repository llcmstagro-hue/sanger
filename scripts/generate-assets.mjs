#!/usr/bin/env node
// ============================================================================
// SANGER · генератор фото-ассетов через OpenAI Images (gpt-image-1)
// ----------------------------------------------------------------------------
// Разбор промпт-пака — в scripts/lib/prompt-pack.mjs (общий с Higgsfield).
//
// Запуск:  OPENAI_API_KEY=sk-... npm run assets      (ключ также из .env.local)
//          Без ключа печатает план и выходит — сборка не зависит.
// Флаги:   --only <substr>  --force  --dry  --limit <n>
// ============================================================================
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadItems, readEnv, parseArgs } from './lib/prompt-pack.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'assets');
const { ONLY, FORCE, DRY, LIMIT } = parseArgs(process.argv.slice(2));

async function generate(key, prompt) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({ model: 'gpt-image-1', prompt, size: '1024x1024', n: 1 }),
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

async function main() {
  const items = await loadItems(ROOT, ONLY);
  console.log(`SANGER assets · OpenAI · найдено ${items.length} кадров в промпт-паке.`);

  const key = await readEnv(ROOT, 'OPENAI_API_KEY');
  if (!key || DRY) {
    if (!key) console.log('\n⚠️  OPENAI_API_KEY не найден — генерация пропущена.');
    console.log('План генерации:');
    for (const it of items.slice(0, LIMIT || items.length)) console.log(`  • public/assets/${it.path}`);
    console.log('\nЗадать ключ: OPENAI_API_KEY=sk-... npm run assets');
    return;
  }

  let done = 0, skipped = 0, failed = 0;
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
    console.log('Дальше: включите available:true в lib/studioAssets.ts и/или подставьте next/image.');
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
