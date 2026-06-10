import { expect, Locator, Page } from '@playwright/test';
import { logger } from '../utils/logger';
import { CookieConsent } from './components/cookie-consent.component';
import { Header } from './components/header.component';

/**
 * Base class every page object extends.
 *
 * Responsibilities:
 *  - hold the Playwright `Page` handle,
 *  - expose shared components (header, cookie consent),
 *  - provide a small set of logged, reusable helpers so individual page
 *    objects stay focused on *what* they do, not boilerplate *how*.
 *
 * Concrete pages declare their own `path`; `open()` reuses the shared
 * navigation + consent handling so no page repeats it.
 */
export abstract class BasePage {
  protected readonly page: Page;
  readonly header: Header;
  readonly cookieConsent: CookieConsent;

  /** Path of this page relative to config.baseURL (e.g. '/login'). */
  protected abstract readonly path: string;

  constructor(page: Page) {
    this.page = page;
    this.header = new Header(page);
    this.cookieConsent = new CookieConsent(page);
  }

  /**
   * Navigates to this page's path and dismisses the consent banner.
   * Returns `this` (typed by the subclass) to allow fluent usage.
   */
  async open(): Promise<this> {
    logger.info(`Opening ${this.constructor.name} at path "${this.path}".`);
    await this.page.goto(this.path, { waitUntil: 'domcontentloaded' });
    await this.cookieConsent.acceptIfPresent();
    return this;
  }

  /** Current page URL. */
  url(): string {
    return this.page.url();
  }

  /** Document <title>. */
  async title(): Promise<string> {
    return this.page.title();
  }

  /**
   * Waits for an element to be visible, logging the intent. Thin wrapper that
   * keeps the timeout/state choice consistent across the suite.
   */
  protected async waitForVisible(locator: Locator, timeout = 15000): Promise<void> {
    await expect(locator).toBeVisible({ timeout });
  }

  /**
   * Clicks an element after ensuring it's actionable. Playwright already
   * auto-waits, but routing clicks through here gives us uniform logging.
   */
  protected async click(locator: Locator, description: string): Promise<void> {
    logger.debug(`Click: ${description}`);
    await locator.click();
  }

  /**
   * Fills a field, clearing any existing value first.
   */
  protected async fill(locator: Locator, value: string, description: string): Promise<void> {
    logger.debug(`Fill: ${description}`);
    await locator.fill(value);
  }
}
