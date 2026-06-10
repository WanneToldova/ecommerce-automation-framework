import { expect, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';

/**
 * The store landing page. Entry point for navigation journeys.
 */
export class HomePage extends BasePage {
  protected readonly path = routes.home;

  constructor(page: Page) {
    super(page);
  }

  /**
   * Asserts the home page loaded by checking the primary navigation is present
   * and we're on the expected host. A light smoke check, not a pixel audit.
   */
  async assertLoaded(): Promise<void> {
    await this.waitForVisible(this.header.productsLink.first());
    await expect(this.page).toHaveURL(/automationexercise\.com/);
  }
}
