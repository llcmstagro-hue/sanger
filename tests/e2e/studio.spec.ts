import { test, expect } from '@playwright/test';

test.describe('Студия дизайна', () => {
  test('смена цвета, фамилии, номера и переключение вида', async ({ page }) => {
    await page.goto('/hockey');
    const studio = page.locator('#studio');
    await studio.scrollIntoViewIfNeeded();

    // desktop-панель видна сразу; на мобиле управление в bottom sheet
    const isDesktop = await page.evaluate(() => window.innerWidth >= 1024);
    if (!isDesktop) {
      await page.getByRole('button', { name: 'Настроить форму' }).click();
    }

    // смена основного цвета — берём именно видимый свотч
    // (скрытая desktop-панель остаётся в DOM на мобиле)
    const swatch = page.locator('button[aria-label="Цвет #1D3A8F"]:visible').first();
    await swatch.click();
    await expect(swatch).toHaveAttribute('aria-pressed', 'true');

    // фамилия и номер попадают в живой предпросмотр (SVG-текст)
    await page.locator('#st-surname:visible').first().fill('ПЕТРОВ');
    await page.locator('#st-number:visible').first().fill('9');
    // номер отрисован и спереди, и сзади
    await expect(studio).toContainText('9');

    // переключение вида: фамилия видна на спине
    if (isDesktop) {
      // на десктопе одновременно видны обе фигуры — спина уже на экране
      await expect(studio).toContainText('ПЕТРОВ');
    } else {
      // на мобиле закрываем настройки и переключаемся на «Сзади»
      await page.getByRole('button', { name: 'Закрыть' }).click();
      await page.getByRole('button', { name: 'Сзади' }).click();
      await expect(studio).toContainText('ПЕТРОВ');
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
