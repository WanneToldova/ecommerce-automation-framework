import { test } from '../../src/fixtures/pages.fixture';
import { generateNewUser } from '../../src/data/test-data';

// Sign-up is the top of the retention funnel — if it breaks, no new customers
// get in. This site is a dedicated practice environment, so creating an account
// here is fine and I run the whole journey: signup details -> account form with
// fresh unique data -> "Account Created!". On a real production site I would
// NOT run this blindly (real accounts, email verification, bot protection), so
// running it here is a conscious test-environment-only choice.
test.describe('Registration', () => {
  test('creates a new account end-to-end', async ({ registrationPage }) => {
    const newUser = generateNewUser();

    await registrationPage.open();
    await registrationPage.register(newUser);

    await registrationPage.assertAccountCreated();
  });
});
