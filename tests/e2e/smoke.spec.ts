import { test, expect } from '@playwright/test';

const ROUTES = ['/', '/hockey', '/football', '/volleyball', '/basketball', '/mma', '/about', '/contacts'];

test.describe('маршруты и базовая структура', () => {
  for (const route of ROUTES) {
    test(`${route} открывается, один H1, нет горизонтального скролла`, async ({ page }) => {
      await page.goto(route);
      await expect(page).toHaveTitle(/SANGER/);
      const h1 = page.locator('h1');
      await expect(h1).toHaveCount(1);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth + 1,
      );
      expect(overflow).toBeTruthy();
    });
  }

  test('спортивная страница содержит нужные секции', async ({ page }) => {
    await page.goto('/hockey');
    for (const id of ['sports', 'works', 'studio', 'production', 'faq', 'lead']) {
      // не все id есть на всех страницах; studio/works/lead обязательны
    }
    await expect(page.locator('#studio')).toBeVisible();
    await expect(page.locator('#works')).toBeVisible();
    await expect(page.locator('#lead')).toBeVisible();
  });
});
