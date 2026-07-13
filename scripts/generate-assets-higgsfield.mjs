#!/usr/bin/env node
// ============================================================================
// SANGER · генератор фото-ассетов через Higgsfield (Soul — фотореализм людей)
// ----------------------------------------------------------------------------
// Тот же промпт-пак, что и у OpenAI-провайдера (scripts/lib/prompt-pack.mjs).
// Higgsfield возвращает URL картинки — скачиваем в public/assets.
//
// Ключ:  HF_CREDENTIALS="KEY_ID:KEY_SECRET"  (env или .env.local)
//        получить: https://cloud.higgsfield.ai → API keys
// Запуск: npm run assets:hf
//        Без ключа печатает план и выходит — сборка не зависит.
// Флаги:  --only <substr>  --force  --dry  --limit <n>
//         --size <WxH>      размер (по умолчанию 1080x1350, портрет 4:5)
//         --quality <720p|1080p>   (по умолчанию 1080p)
//         --endpoint <path>        (по умолчанию /v1/text2image/soul)
// ============================================================================
import { writeFile, mkdir, access } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadItems, readEnv, parseArgs } from './lib/prompt-pack.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'assets');

const argv = process.argv.slice(2);
const { ONLY, FORCE, DRY, LIMIT } = parseArgs(argv);
const optVal = (name, def) => {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] ? argv[i + 1] : def;
};
const SIZE = optVal('--size', '1080x1350');
const QUALITY = optVal('--quality', '1080p');
const ENDPOINT = optVal('--endpoint', '/v1/text2image/soul');

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
  console.log(`SANGER assets · Higgsfield (${ENDPOINT}) · найдено ${items.length} кадров.`);

  const creds = await readEnv(ROOT, 'HF_CREDENTIALS');
  if (!creds || DRY) {
    if (!creds) console.log('\n⚠️  HF_CREDENTIALS не найден — генерация пропущена.');
    console.log('План генерации:');
    for (const it of items.slice(0, LIMIT || items.length)) console.log(`  • public/assets/${it.path}`);
    console.log('\nЗадать ключ: HF_CREDENTIALS="KEY_ID:KEY_SECRET" npm run assets:hf');
    return;
  }

  // SDK грузим динамически — чтобы --dry работал без установленного пакета.
  const { higgsfield, config } = await import('@higgsfield/client/v2');
  config({ credentials: creds });

  let done = 0, skipped = 0, failed = 0;
  for (const it of items) {
    if (LIMIT && done >= LIMIT) break;
    const outPath = join(OUT_DIR, it.path);
    if (!FORCE && (await fileExists(outPath))) {
      skipped++;
      continue;
    }
    try {
      const res = await higgsfield.subscribe(ENDPOINT, {
        input: {
          prompt: it.prompt,
          width_and_height: SIZE,
          quality: QUALITY,
          batch_size: 1,
          enhance_prompt: true,
        },
        withPolling: true,
      });

      if (res.status === 'nsfw') throw new Error('ответ помечен nsfw');
      if (res.status !== 'completed') throw new Error(`статус ${res.status}`);
      const url = res.images?.[0]?.url;
      if (!url) throw new Error('нет url в ответе');

      const img = await fetch(url);
      if (!img.ok) throw new Error(`скачивание ${img.status}`);
      const buf = Buffer.from(await img.arrayBuffer());

      await mkdir(dirname(outPath), { recursive: true });
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
