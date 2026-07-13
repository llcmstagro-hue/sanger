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
    // структура ТЗ: производство, материалы, форма заявки — без «Наши работы»/конструктора
    await expect(page.locator('#production')).toBeVisible();
    await expect(page.locator('#materials')).toBeVisible();
    await expect(page.locator('#lead')).toBeVisible();
    // конструктор ушёл на отдельную страницу
    await expect(page.locator('#studio')).toHaveCount(0);
  });
});
