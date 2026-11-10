import { defineConfig, devices } from '@playwright/test';
import path from 'node:path';

const runId = process.env.QA_RUN_ID ?? 'direct';
if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{0,79}$/.test(runId)) {
  throw new Error('QA_RUN_ID får innehålla högst 80 bokstäver, siffror och bindestreck.');
}
const runDirectory = path.join(__dirname, 'test-results', 'workflow', runId);
const storageState = process.env.QA_STORAGE_STATE;

export default defineConfig({
  testDir: './tests',
  testMatch: 'qlerify-workflow.spec.ts',
  workers: 1,
  retries: 0,
  forbidOnly: Boolean(process.env.CI),
  timeout: 60_000,
  expect: { timeout: 12_000 },
  outputDir: path.join(runDirectory, 'artifacts'),
  reporter: [
    ['list'],
    ['json', { outputFile: path.join(runDirectory, 'result.json') }],
    ['html', { outputFolder: path.join(runDirectory, 'html'), open: 'never' }],
  ],
  projects: [{
    name: 'chromium-workflow',
    use: {
      ...devices['Desktop Chrome'],
      ...(storageState ? { storageState } : {}),
      screenshot: 'only-on-failure',
      trace: 'retain-on-failure',
    },
  }],
});
