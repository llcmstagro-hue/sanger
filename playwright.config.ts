import { existsSync } from 'node:fs';
import { defineConfig, devices } from '@playwright/test';

// В окружениях, где предустановлен Chromium (напр. /opt/pw-browsers/chromium),
// используем его напрямую — это избавляет от `playwright install` при офлайн-сборке.
const chromiumPath =
  process.env.PLAYWRIGHT_CHROMIUM_PATH ||
  (existsSync('/opt/pw-browsers/chromium') ? '/opt/pw-browsers/chromium' : undefined);

export default defineConfig({
  testDir: './tests/e2e',
  timeout: 30_000,
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    launchOptions: {
      executablePath: chromiumPath,
      args: ['--no-sandbox'],
    },
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium', browserName: 'chromium' } },
  ],
});
