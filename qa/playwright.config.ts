import { defineConfig, devices } from '@playwright/test';

const authState = process.env.QA_STORAGE_STATE;

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: 30_000,
  expect: { timeout: 7_000 },
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  outputDir: 'test-results',
  projects: [
    {
      name: 'chromium-public',
      testMatch: /qlerify-public\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://qlerify.com',
        trace: 'retain-on-failure',
      },
    },
    {
      name: 'chromium-authenticated',
      testMatch: /qlerify-authenticated\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'https://app.qlerify.com',
        ...(authState ? { storageState: authState } : {}),
        trace: 'retain-on-failure',
      },
    },
  ],
});
