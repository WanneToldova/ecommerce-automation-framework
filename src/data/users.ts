/**
 * Deliberately invalid credentials for the negative login test.
 * These never correspond to a real account, so the test is safe and stable.
 */
export const INVALID_CREDENTIALS = {
  email: 'wanneinvalidcredencial@example.com',
  password: 'WrongPassword123!',
} as const;
