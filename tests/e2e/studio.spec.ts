import { test, expect } from '@playwright/test';

test.describe('Студия дизайна', () => {
  test('смена цвета, фамилии, номера и переключение вида', async ({ page }) => {
    await page.goto('/hockey');
    const studio = page.locator('#studio');
    await studio.scrollIntoViewIfNeeded();

    // desktop-панель; на мобиле управление в bottom sheet.
    // Панель с управлением дублируется в DOM (desktop + мобильный лист), поэтому
    // все взаимодействия скоупим к активной панели.
    const isDesktop = await page.evaluate(() => window.innerWidth >= 1024);
    if (!isDesktop) {
      await page.getByRole('button', { name: 'Настроить форму' }).click();
    }
    const panel = isDesktop ? studio : page.getByRole('dialog', { name: 'Настройки формы' });

    // смена основного цвета
    await panel.locator('button[aria-label="Цвет #1D3A8F"]').click();
    await expect(studio).toContainText('Вид спереди');

    // фамилия и номер
    await panel.locator('#st-surname').fill('ПЕТРОВ');
    await panel.locator('#st-number').fill('9');
    await expect(studio.locator('svg').first()).toContainText('9');

    // переключение вида (спереди/сзади)
    if (isDesktop) {
      // на десктопе видны обе фигуры сразу — фамилия отображается на спине
      const back = studio.locator('figure', { hasText: 'Вид сзади' });
      await expect(back.locator('svg')).toContainText('ПЕТРОВ');
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
