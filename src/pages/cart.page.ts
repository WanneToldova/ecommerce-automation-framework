import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';
import { logger } from '../utils/logger';

/**
 * The shopping cart page — /view_cart.
 */
export class CartPage extends BasePage {
  protected readonly path = routes.cart;

  readonly lineItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.lineItems = page.locator('#cart_info_table tbody tr');
    this.checkoutButton = page.locator('a.check_out, .btn.check_out').first();
    this.emptyMessage = page.locator('#empty_cart').getByText(/cart is empty/i);
  }

  /** Number of line items in the cart. */
  async itemCount(): Promise<number> {
    return this.lineItems.count();
  }

  /** Asserts the cart holds at least one item and exposes a checkout path. */
  async assertHasItems(): Promise<void> {
    logger.info('Verifying the cart contains at least one item.');
    await expect(this.lineItems.first()).toBeVisible({ timeout: 15000 });
    await expect(this.checkoutButton).toBeVisible();
  }
}
