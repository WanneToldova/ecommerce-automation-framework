import { expect, Locator, Page } from '@playwright/test';
import { BasePage } from './base.page';
import { routes } from '../config/routes';
import { logger } from '../utils/logger';

/**
 * The "All Products" / product listing page (PLP).
 *
 * Hosts the catalogue grid, the search box, the "View Product" links, and the
 * "Add to cart" actions (which open the site's cart modal). Search on
 * Automation Exercise lives on this page, so search journeys start here.
 */
export class ProductsPage extends BasePage {
  protected readonly path = routes.products;

  readonly searchInput: Locator;
  readonly searchButton: Locator;
  readonly productCards: Locator;
  readonly searchedProductsHeading: Locator;
  readonly cartModal: Locator;
  readonly viewCartLink: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    super(page);

    this.searchInput = page.locator('#search_product');
    this.searchButton = page.locator('#submit_search');

    // Scope to the main grid (.features_items) so the "recommended items"
    // carousel at the bottom of the page is not counted.
    this.productCards = page.locator('.features_items .product-image-wrapper');

    this.searchedProductsHeading = page.getByRole('heading', { name: /searched products/i });

    // The Bootstrap modal shown after adding an item to the cart.
    this.cartModal = page.locator('#cartModal');
    this.viewCartLink = this.cartModal.locator('a[href="/view_cart"]');
    this.continueShoppingButton = this.cartModal.locator('button[data-dismiss="modal"]');
  }

  /** Submits a search term. */
  async search(term: string): Promise<void> {
    logger.info(`Searching products for "${term}".`);
    await this.searchInput.fill(term);
    await this.searchButton.click();
  }

  /** Waits until at least one product card is rendered. */
  async waitForResults(): Promise<void> {
    await expect(this.productCards.first()).toBeVisible({ timeout: 20000 });
  }

  /** Number of product cards currently in the main grid. */
  async productCount(): Promise<number> {
    return this.productCards.count();
  }

  /** Opens the product details page for the card at `index`. */
  async viewProduct(index = 0): Promise<void> {
    logger.info(`Opening product #${index} details.`);
    const card = this.productCards.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.locator('a[href*="/product_details/"]').click();
  }

  /**
   * Adds the product at `index` to the cart and waits for the confirmation
   * modal. Hovers the card first so the overlay "Add to cart" is interactable,
   * mirroring the real user interaction.
   */
  async addProductToCart(index = 0): Promise<void> {
    logger.info(`Adding product #${index} to the cart.`);
    const card = this.productCards.nth(index);
    await card.scrollIntoViewIfNeeded();
    await card.hover();
    await card.locator('.product-overlay .add-to-cart').first().click();
    await expect(this.cartModal).toBeVisible({ timeout: 10000 });
  }

  /** Follows the "View Cart" link in the confirmation modal. */
  async viewCartFromModal(): Promise<void> {
    await this.viewCartLink.click();
  }
}
