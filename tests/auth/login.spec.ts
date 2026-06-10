import { test } from '../../src/fixtures/pages.fixture';
import { config } from '../../src/config/env.config';
import { INVALID_CREDENTIALS } from '../../src/data/users';

/**
 * AUTHENTICATION — LOGIN
 *
 * Why this is critical: returning customers expect to sign in to see orders and
 * check out faster. We test two angles:
 *
 *  1. Negative path (always runs): invalid credentials must be rejected with a
 *     clear error. Needs no real account, is deterministic, and guards the most
 *     security-relevant behaviour — that wrong credentials never get in.
 *
 *  2. Happy path (conditional): a valid sign-in. Requires a real test account,
 *     so it self-skips unless TEST_USER_EMAIL / TEST_USER_PASSWORD are provided
 *     in .env. (On this practice site you can register an account and drop its
 *     credentials into .env to enable this test.) Skipping rather than failing
 *     keeps the default run green for any reviewer.
 */
test.describe('Login', () => {
  test('rejects invalid credentials with an error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password);
    await loginPage.assertLoginError();
  });

  test('signs in successfully with valid credentials', async ({ loginPage }) => {
    test.skip(
      !config.hasCredentials,
      'No TEST_USER_EMAIL / TEST_USER_PASSWORD provided — skipping login happy path.',
    );

    await loginPage.open();
    await loginPage.login(config.credentials.email, config.credentials.password);

    // A successful sign-in surfaces the "Logged in as" indicator in the nav.
    test.expect(await loginPage.header.isLoggedIn()).toBeTruthy();
  });
});
