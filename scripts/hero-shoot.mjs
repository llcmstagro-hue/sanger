import { chromium } from '@playwright/test';
import { mkdirSync } from 'fs';

const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const url = process.argv[2] || 'http://localhost:3000/hockey';
const outDir = process.argv[3] || '/tmp/claude-0/-home-user-sanger/3ffa7a81-d84b-5cae-a55e-09304a75fff7/scratchpad/hero';
mkdirSync(outDir, { recursive: true });

const sizes = [
  ['desktop-1440', 1440, 900, false],
  ['desktop-1920', 1920, 1080, false],
  ['mobile-375', 375, 812, true],
  ['mobile-390', 390, 844, true],
  ['mobile-393', 393, 852, true],
  ['mobile-430', 430, 932, true],
];

const browser = await chromium.launch({ executablePath: exe, args: ['--no-sandbox'] });
for (const [name, w, h, mobile] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: mobile ? 2 : 1, isMobile: mobile });
  const page = await ctx.newPage();
  const errs = [];
  page.on('console', (m) => { if (m.type() === 'error') errs.push(m.text()); });
  page.on('pageerror', (e) => errs.push('PAGEERROR ' + e.message));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch((e) => console.log('nav', e.message));
  await page.waitForTimeout(3800); // дать интро-анимациям отыграть
  // проверка горизонтального скролла
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage: false });
  console.log(`${name}: overflowX=${overflow}px errs=${errs.length}${errs.length ? ' :: ' + errs.slice(0, 2).join(' | ') : ''}`);
  await ctx.close();
}
await browser.close();
