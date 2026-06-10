import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';
import { logger } from '../utils/logger';

/**
 * The sign-in form (left side of /login).
 *
 * Uses the site's data-qa hooks — semantic, stable attributes provided
 * specifically for automation, which are the most resilient anchors available.
 */
export class LoginPage extends BasePage {
  protected readonly path = routes.login;

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.emailInput = page.locator('input[data-qa="login-email"]');
    this.passwordInput = page.locator('input[data-qa="login-password"]');
    this.submitButton = page.locator('button[data-qa="login-button"]');
    this.errorMessage = page.getByText(/your email or password is incorrect/i);
  }

  /** Submits the sign-in form with the given credentials. */
  async login(email: string, password: string): Promise<void> {
    logger.info(`Submitting login for "${email}".`);
    await this.waitForVisible(this.emailInput);
    await this.fill(this.emailInput, email, 'login email');
    await this.fill(this.passwordInput, password, 'login password');
    await this.click(this.submitButton, 'login button');
  }

  /** Asserts the invalid-credentials error is shown (negative test). */
  async assertLoginError(): Promise<void> {
    await expect(this.errorMessage).toBeVisible({ timeout: 15000 });
  }
}
