import * as dotenv from 'dotenv';

// Load variables from a local .env file if present. Anything not set there
// falls back to the defaults below, so the framework runs without any setup.
dotenv.config();

/**
 * Supported target environments. Add more here (e.g. 'qa', 'uat') as needed
 * and map them to a base URL in {@link baseUrlByEnv}.
 */
export type TestEnv = 'prod' | 'staging';

/**
 * Base URLs per environment.
 *
 * Target site: Automation Exercise (https://automationexercise.com) — a
 * full-featured e-commerce site purpose-built for automation practice. It was
 * chosen because the brands listed in the challenge sit behind Akamai bot
 * protection that denies automated traffic, whereas this site exposes stable,
 * semantic test hooks (data-qa attributes) and permits the full journey,
 * including account creation, against a dedicated test environment.
 *
 * The framework is site-agnostic: point BASE_URL at any store to retarget.
 */
const baseUrlByEnv: Record<TestEnv, string> = {
  prod: 'https://automationexercise.com',
  staging: 'https://automationexercise.com',
};

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined) return fallback;
  return value.toLowerCase() === 'true';
}

function parseNumber(value: string | undefined, fallback: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

const testEnv = (process.env.TEST_ENV as TestEnv) ?? 'prod';

/**
 * The single source of truth for runtime configuration. Imported by
 * `playwright.config.ts`, page objects, and tests so settings live in one place.
 */
export const config = {
  /** Logical environment name, e.g. 'prod'. */
  env: testEnv,

  /** Base URL all relative navigations resolve against. */
  baseURL: process.env.BASE_URL ?? baseUrlByEnv[testEnv],

  /** Run browsers without a visible window when true. */
  headless: parseBoolean(process.env.HEADLESS, true),

  /** Artificial delay (ms) between actions — handy for debugging flaky steps. */
  slowMo: parseNumber(process.env.SLOW_MO, 0),

  /** Winston log level: error | warn | info | debug. */
  logLevel: process.env.LOG_LEVEL ?? 'info',

  /**
   * Credentials for the login happy-path test. Kept out of source control —
   * supply them via .env. When absent, that test skips itself gracefully.
   * (On this practice site you can register an account, then put it here.)
   */
  credentials: {
    email: process.env.TEST_USER_EMAIL ?? '',
    password: process.env.TEST_USER_PASSWORD ?? '',
  },

  /** True when valid login credentials have been provided. */
  get hasCredentials(): boolean {
    return Boolean(this.credentials.email && this.credentials.password);
  },
} as const;
