import { Locator, Page } from '@playwright/test';
import { logger } from '../../utils/logger';

/**
 * Handles any consent / cookie banner that may appear.
 *
 * Automation Exercise serves third-party ads, which can trigger a Google
 * "consent" prompt for EEA visitors. We block ad networks at the network layer
 * (see pages.fixture.ts) which usually prevents the prompt entirely; this
 * component is a defensive fallback. It never throws — the absence of a banner
 * is a valid state, not a test failure.
 */
export class CookieConsent {
  private readonly acceptButton: Locator;

  constructor(page: Page) {
    this.acceptButton = page
      .getByRole('button', { name: /consent|accept|agree|allow/i })
      .first();
  }

  async acceptIfPresent(): Promise<void> {
    try {
      await this.acceptButton.waitFor({ state: 'visible', timeout: 3000 });
      await this.acceptButton.click();
      logger.debug('Consent banner accepted.');
    } catch {
      logger.debug('No consent banner appeared (or it was already dismissed).');
    }
  }
}
