---
name: web-app-testing
description: How to run, drive and test the SANGER Next.js app in this environment. Use when running the dev server, taking screenshots, or executing the Playwright e2e suite (smoke / studio / form) — especially because the sandbox ships only a pre-installed Chromium and blocks the Playwright browser CDN.
---

# SANGER — запуск и тестирование

## Быстрые проверки
```bash
npm run typecheck   # tsc --noEmit
npm run build       # прод-сборка (внутри — lint)
npm run dev         # http://localhost:3000
```

## Playwright в этом окружении (важно)
Проект пинует `@playwright/test@1.45.3`, который хочет `chromium-1124` и `webkit`.
Их **нельзя скачать** (CDN за прокси заблокирован). Предустановлен только
`chromium-1194` в `/opt/pw-browsers/`. Поэтому:

- Рабочий `playwright.config.ts` (iPhone 13/WebKit) оставляем для нормальных сред,
  где сработает `npx playwright install`.
- Локально в песочнице гоняем через `playwright.local.ts` (в `.gitignore`), который
  указывает `executablePath` на предустановленный Chromium и переводит mobile-проект
  на Chromium (Pixel 5):

```ts
// playwright.local.ts
import { defineConfig, devices } from '@playwright/test';
const chromePath = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
export default defineConfig({
  testDir: './tests/e2e', timeout: 30_000, fullyParallel: true, reporter: 'list',
  use: { baseURL: 'http://localhost:3000', trace: 'off' },
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 120_000 },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], launchOptions: { executablePath: chromePath } } },
    { name: 'mobile',  use: { ...devices['Pixel 5'],        launchOptions: { executablePath: chromePath } } },
  ],
});
```
```bash
npx playwright test --config=playwright.local.ts               # весь набор
npx playwright test --config=playwright.local.ts smoke.spec.ts # только smoke
```

## Скриншоты вживую
Поднять `npm run dev`, затем через node + `@playwright/test` (chromium с
`executablePath`, `args:['--no-sandbox']`) снять desktop (1440×900) и iPhone
(390×844) — так проверяем hero и мобайл на реальном рендере.

## Что покрывают тесты
- `smoke.spec.ts` — 8 маршрутов открываются, ровно один H1, нет горизонтального скролла.
- `studio.spec.ts` — студия: цвет/фамилия/номер/вид (скоуп к видимой панели).
- `form.spec.ts` — валидация, успех только после ответа сервера, нет ложного успеха.

Перед коммитом нетривиального изменения: typecheck + build + затронутые e2e зелёные.
