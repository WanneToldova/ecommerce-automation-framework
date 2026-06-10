import { defineConfig, devices } from '@playwright/test';
import { config } from './src/config/env.config';

/**
 * Playwright configuration.
 *
 * All environment-specific values (base URL, headless, slow-mo) come from
 * `src/config/env.config.ts`, which reads `.env`. This keeps the config file
 * declarative and means switching environments is an env-var change, never a
 * code change.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',

  // Fail the build on CI if a `test.only` was accidentally committed.
  forbidOnly: !!process.env.CI,

  // Retry flaky tests on CI; locally, fail fast for a tight feedback loop.
  retries: process.env.CI ? 2 : 0,

  // Limit workers on CI for stability; use the default (cores) locally.
  workers: process.env.CI ? 2 : undefined,

  // Run tests in parallel within files.
  fullyParallel: true,

  // Per-test timeout and assertion timeout.
  timeout: 60_000,
  expect: { timeout: 15_000 },

  /**
   * Reporters:
   *  - 'html'   : interactive, screenshot/trace-rich report (the main deliverable).
   *  - 'json'   : machine-readable results for CI dashboards / further processing.
   *  - 'junit'  : consumed by most CI systems (GitHub Actions, Jenkins, etc.).
   *  - 'list'   : live console output during the run.
   *  - custom   : pipes a concise summary into our winston logs.
   */
  reporter: [
    ['html', { outputFolder: 'reports/html', open: 'never' }],
    ['json', { outputFile: 'reports/results.json' }],
    ['junit', { outputFile: 'reports/junit.xml' }],
    ['list'],
    ['./src/reporters/logging-reporter.ts'],
  ],

  // Folder for raw test artifacts (traces, screenshots, videos).
  outputDir: 'test-results',

  use: {
    baseURL: config.baseURL,
    headless: config.headless,
    launchOptions: { slowMo: config.slowMo },

    // Diagnostics on failure — the trio that makes failures debuggable.
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Reasonable action/navigation timeouts for a real, sometimes-slow site.
     actionTimeout: 30_000,
    navigationTimeout: 60_000,

    // A realistic viewport and locale for a UK retail site.
    viewport: { width: 1366, height: 900 },
    locale: 'en-GB',
    timezoneId: 'Europe/London',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    // Cross-browser coverage is available out of the box — enable as needed.
    // Kept commented so the default run is fast and deterministic.
    // {
    //   name: 'firefox',
    //   use: { ...devices['Desktop Firefox'] },
    // },
    // {
    //   name: 'webkit',
    //   use: { ...devices['Desktop Safari'] },
    // },
    // {
    //   name: 'mobile-chrome',
    //   use: { ...devices['Pixel 7'] },
    // },
  ],
});
