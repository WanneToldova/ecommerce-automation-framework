import { Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { logger } from '../utils/logger';

/**
 * Product Details Page (PDP) — /product_details/{id}.
 *
 * The conversion-critical page where the shopper reviews an item and adds it
 * to the cart.
 */
export class ProductPage extends BasePage {
  protected readonly path = '';

  readonly name: Locator;
  readonly price: Locator;
  readonly quantity: Locator;
  readonly addToCartButton: Locator;

  constructor(page: Page) {
    super(page);

    const info = page.locator('.product-information');
    this.name = info.locator('h2').first();
    // Price renders as "Rs. <n>" inside the information block.
    this.price = info.getByText(/Rs\.?\s*\d+/).first();
    this.quantity = page.locator('#quantity');
    this.addToCartButton = page.getByRole('button', { name: /add to cart/i }).first();
  }

  /** Verifies the PDP rendered its essentials: a name and a price. */
  async assertLoaded(): Promise<void> {
    logger.info('Verifying the product details page loaded.');
    await this.waitForVisible(this.name);
    await this.waitForVisible(this.price);
  }

  /** Sets the quantity field (PDP supports buying multiples). */
  async setQuantity(value: number): Promise<void> {
    await this.quantity.fill(String(value));
  }

  /** Clicks "Add to cart" on the PDP. */
  async addToCart(): Promise<void> {
    logger.info('Adding the product to the cart from the PDP.');
    await this.addToCartButton.click();
  }
}
