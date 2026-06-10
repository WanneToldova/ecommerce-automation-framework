import { Locator, Page } from '@playwright/test';
import { logger } from '../../utils/logger';

/**
 * The site header / navigation — present on every page. Encapsulating it as a
 * component (rather than copying nav locators into each page object) keeps
 * things DRY: one place to update if the navigation markup changes.
 *
 * Locators use the stable href values and the site's data hooks, which are
 * the most resilient anchors Automation Exercise provides.
 */
export class Header {
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly cartLink: Locator;
  readonly signupLoginLink: Locator;
  readonly logoutLink: Locator;
  readonly loggedInAs: Locator;

  constructor(page: Page) {
    this.homeLink = page.locator('.navbar-nav a[href="/"]').first();
    this.productsLink = page.locator('.navbar-nav a[href="/products"]');
    this.cartLink = page.locator('.navbar-nav a[href="/view_cart"]').first();
    this.signupLoginLink = page.locator('.navbar-nav a[href="/login"]');
    this.logoutLink = page.locator('.navbar-nav a[href="/logout"]');
    // "Logged in as <name>" appears in the nav once authenticated.
    this.loggedInAs = page.locator('.navbar-nav a:has-text("Logged in as")');
  }

  async goToProducts(): Promise<void> {
    logger.info('Navigating to Products via the header.');
    await this.productsLink.click();
  }

  async goToCart(): Promise<void> {
    logger.info('Navigating to Cart via the header.');
    await this.cartLink.click();
  }

  async goToSignupLogin(): Promise<void> {
    logger.info('Navigating to Signup/Login via the header.');
    await this.signupLoginLink.click();
  }

  /** True when the "Logged in as" indicator is present in the nav. */
  async isLoggedIn(): Promise<boolean> {
    return (await this.loggedInAs.count()) > 0;
  }
}
