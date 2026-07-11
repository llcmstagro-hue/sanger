import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/hockey', '/football', '/volleyball', '/basketball', '/mma', '/about', '/contacts'];

test.describe('консоль и горизонтальный скролл', () => {
  for (const route of ROUTES) {
    test(`${route} без ошибок в консоли`, async ({ page }) => {
      const errors: string[] = [];
      page.on('console', (m) => {
        if (m.type() === 'error') errors.push(m.text());
      });
      page.on('pageerror', (e) => errors.push(String(e)));
      page.on('response', (r) => {
        if (r.status() >= 400) errors.push(`${r.status()} ${r.url()}`);
      });
      await page.goto(route, { waitUntil: 'networkidle' });
      const noOverflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      expect(noOverflow, 'горизонтальный скролл').toBeTruthy();
      expect(errors, errors.join('\n')).toHaveLength(0);
    });
  }
});
