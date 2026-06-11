import { test } from '../../src/fixtures/pages.fixture';
import { config } from '../../src/config/env.config';
import { INVALID_CREDENTIALS } from '../../src/data/users';

// Returning customers need to sign in, so I cover login from two sides.
//
// The negative case always runs: wrong credentials must be rejected with a
// clear error. It needs no real account, it's deterministic, and it guards the
// behaviour that matters most for security — that bad credentials never get in.
//
// The happy path needs a real account, so it skips itself unless credentials
// are set in .env. (Easiest way: run the registration test once, then put that
// account's email + password in .env.) Skipping instead of failing keeps the
// default run green for whoever clones the repo.
test.describe('Login', () => {
  test('rejects invalid credentials with an error message', async ({ loginPage }) => {
    await loginPage.open();
    await loginPage.login(INVALID_CREDENTIALS.email, INVALID_CREDENTIALS.password);
    await loginPage.assertLoginError();
  });

  test('signs in successfully with valid credentials', async ({ loginPage }) => {
    test.skip(!config.hasCredentials, 'Set TEST_USER_EMAIL / TEST_USER_PASSWORD in .env to run this.');

    await loginPage.open();
    await loginPage.login(config.credentials.email, config.credentials.password);

    // A good sign-in shows "Logged in as ..." in the nav.
    test.expect(await loginPage.header.isLoggedIn()).toBeTruthy();
  });
});
