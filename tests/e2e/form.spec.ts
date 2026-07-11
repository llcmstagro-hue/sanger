import { test, expect } from '@playwright/test';

test.describe('Форма заявки', () => {
  test('валидация не пускает пустую форму', async ({ page }) => {
    await page.goto('/hockey');
    await page.locator('#lead').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Получить расчёт' }).last().click();
    await expect(page.getByText('Укажите имя')).toBeVisible();
  });

  test('успех показывается только после ответа сервера', async ({ page }) => {
    // мок серверного ответа
    await page.route('**/api/lead', (route) =>
      route.fulfill({ status: 200, contentType: 'application/json', body: '{"ok":true}' }),
    );
    await page.goto('/hockey');
    await page.locator('#lead').scrollIntoViewIfNeeded();
    await page.locator('#l-name').fill('Алексей');
    await page.locator('#l-phone').fill('+7 999 123 45 67');
    await page.locator('#l-sport').selectOption({ label: 'Хоккей' });
    await page.locator('#l-qty').fill('8');
    await page.getByLabel('Согласен на обработку персональных данных').check();
    await page.getByRole('button', { name: 'Получить расчёт' }).last().click();
    await expect(page.getByText('Проект отправлен')).toBeVisible();
  });

  test('ошибка сервера не показывает ложный успех', async ({ page }) => {
    await page.route('**/api/lead', (route) => route.fulfill({ status: 500, body: '{"ok":false}' }));
    await page.goto('/hockey');
    await page.locator('#lead').scrollIntoViewIfNeeded();
    await page.locator('#l-name').fill('Алексей');
    await page.locator('#l-phone').fill('+7 999 123 45 67');
    await page.locator('#l-sport').selectOption({ label: 'Хоккей' });
    await page.locator('#l-qty').fill('8');
    await page.getByLabel('Согласен на обработку персональных данных').check();
    await page.getByRole('button', { name: 'Получить расчёт' }).last().click();
    await expect(page.getByText('Не удалось отправить заявку', { exact: false })).toBeVisible();
    await expect(page.getByText('Проект отправлен')).toHaveCount(0);
  });
});
