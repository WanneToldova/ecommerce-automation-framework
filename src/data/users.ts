/**
 * Bad credentials for the negative login test. They never match a real
 * account, so the test stays deterministic and safe.
 */
export const INVALID_CREDENTIALS = {
  email: 'wanne.invalid@example.com',
  password: 'WrongPassword123!',
} as const;
