import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import playwright from 'eslint-plugin-playwright';

export default tseslint.config(
  {
    ignores: ['node_modules/', 'reports/', 'test-results/', 'logs/', 'playwright-report/'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    // Apply Playwright's recommended rules only to the test files.
    files: ['tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      // Our assertions intentionally live inside Page Object methods (assert*,
      // waitForResults). Teach the rule to count those as assertions so it
      // doesn't false-positive on the POM pattern.
      'playwright/expect-expect': [
        'warn',
        {
          assertFunctionNames: [
            'assertLoaded',
            'assertAddedToBag',
            'assertHasItems',
            'assertLoginError',
            'assertAccountCreated',
            'assertRequiredFieldValidation',
            'waitForResults',
          ],
        },
      ],
      // Conditional, credential-gated skipping is a deliberate, documented
      // pattern for the login happy path — not an accidentally-skipped test.
      'playwright/no-skipped-test': 'off',
    },
  },
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-empty-function': 'off',
      'no-empty-pattern': 'off',
    },
  },
);
