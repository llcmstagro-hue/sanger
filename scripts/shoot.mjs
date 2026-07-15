import { chromium } from '@playwright/test';

const exe = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const base = process.argv[2] || 'https://harmonious-lollipop-19146b.netlify.app';
const routes = (process.argv[3] || '/').split(',');
const outDir = process.argv[4] || '/tmp/claude-0/-home-user-sanger/3ffa7a81-d84b-5cae-a55e-09304a75fff7/scratchpad/shots';

import { mkdirSync } from 'fs';
mkdirSync(outDir, { recursive: true });

const isLocal = /localhost|127\.0\.0\.1/.test(base);
const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
const browser = await chromium.launch({
  executablePath: exe,
  args: ['--no-sandbox', '--ignore-certificate-errors'],
  proxy: (!isLocal && proxy) ? { server: proxy } : undefined,
});

async function settle(page) {
  // Scroll through the page in steps to trigger whileInView reveals, then back to top.
  const h = await page.evaluate(() => document.body.scrollHeight);
  const vp = await page.evaluate(() => window.innerHeight);
  for (let y = 0; y < h; y += Math.floor(vp * 0.8)) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(220);
  }
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(500);
}

for (const route of routes) {
  const slug = route.replace(/[\/]/g, '_') || 'root';
  // desktop
  const d = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
  const dp = await d.newPage();
  await dp.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('nav err', e.message));
  await dp.waitForTimeout(1500);
  await settle(dp);
  await dp.screenshot({ path: `${outDir}/${slug}_desktop.png`, fullPage: true });
  await d.close();
  // mobile 390
  const m = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true });
  const mp = await m.newPage();
  await mp.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 60000 }).catch(e => console.log('nav err', e.message));
  await mp.waitForTimeout(1500);
  await settle(mp);
  await mp.screenshot({ path: `${outDir}/${slug}_mobile.png`, fullPage: true });
  await m.close();
  console.log('shot', route);
}

await browser.close();
