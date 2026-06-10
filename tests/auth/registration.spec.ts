import { test } from '../../src/fixtures/pages.fixture';
import { generateNewUser } from '../../src/data/test-data';

/**
 * AUTHENTICATION — REGISTRATION
 *
 * Why this is critical: account creation is the top of the customer-retention
 * funnel; a broken signup blocks every new shopper.
 *
 * Because Automation Exercise is a dedicated test environment that permits
 * account creation, we run the full end-to-end journey: enter signup details,
 * complete the account information form with freshly generated unique data, and
 * assert the "Account Created!" confirmation. Against a production site this is
 * exactly the test you would NOT run blindly (real accounts, verification,
 * bot protection) — running it here demonstrates understanding of the
 * test-vs-production environment distinction.
 */
test.describe('Registration', () => {
  test('creates a new account end-to-end', async ({ registrationPage }) => {
    const newUser = generateNewUser();

    await registrationPage.open();
    await registrationPage.register(newUser);

    await registrationPage.assertAccountCreated();
  });
});
