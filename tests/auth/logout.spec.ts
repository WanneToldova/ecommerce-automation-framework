import { test, expect } from '../../src/fixtures/pages.fixture';
import { generateNewUser } from '../../src/data/test-data';

// Logout is short but worth covering: a broken logout is a real privacy/shared-
// device problem. I create a fresh account (which leaves me signed in), confirm
// the signed-in state, then log out and check the app returns to signed-out.
test.describe('Logout', () => {
  test('signs the user out and returns to the logged-out state', async ({ registrationPage }) => {
    const newUser = generateNewUser();

    await registrationPage.open();
    await registrationPage.register(newUser);
    await registrationPage.assertAccountCreated();
    await registrationPage.continueAfterCreation();

    // Signed in now.
    expect(await registrationPage.header.isLoggedIn()).toBeTruthy();

    await registrationPage.header.logout();

    // Back to signed-out: the Signup/Login link returns and "Logged in as" is gone.
    await expect(registrationPage.header.signupLoginLink).toBeVisible();
    expect(await registrationPage.header.isLoggedIn()).toBeFalsy();
  });
});
