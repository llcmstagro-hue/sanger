import { test, expect } from '@playwright/test';

test.describe('Студия дизайна', () => {
  test('смена цвета, фамилии, номера и переключение вида', async ({ page }) => {
    await page.goto('/hockey');
    const studio = page.locator('#studio');
    await studio.scrollIntoViewIfNeeded();

    // desktop-панель; на мобиле управление в bottom sheet
    const isDesktop = await page.evaluate(() => window.innerWidth >= 1024);
    if (!isDesktop) {
      await page.getByRole('button', { name: 'Настроить форму' }).click();
    }

    // смена основного цвета
    await page.locator('button[aria-label="Цвет #1D3A8F"]').first().click();
    const svg = studio.locator('#studio svg, svg').first();
    await expect(studio).toContainText('Вид спереди');

    // фамилия и номер
    const surname = page.locator('#st-surname');
    await surname.fill('ПЕТРОВ');
    const number = page.locator('#st-number');
    await number.fill('9');
    await expect(studio.locator('svg')).toContainText('9');

    // переключение вида (спереди/сзади)
    if (isDesktop) {
      await page.getByRole('button', { name: 'Сзади' }).click();
      await expect(studio.locator('svg')).toContainText('ПЕТРОВ');
    }
  });

  test('кнопка «Получить расчёт» ведёт к форме', async ({ page }) => {
    await page.goto('/hockey');
    await page.locator('#studio').scrollIntoViewIfNeeded();
    const btn = page.getByRole('button', { name: 'Получить расчёт' }).first();
    await btn.click();
    await expect(page.locator('#lead')).toBeInViewport({ ratio: 0.1 });
  });
});
