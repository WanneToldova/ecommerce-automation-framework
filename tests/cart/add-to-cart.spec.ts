import { test } from '../../src/fixtures/pages.fixture';

/**
 * ADD TO CART
 *
 * Why this is critical: this is the key conversion event before checkout. It
 * chains the discovery funnel — browse → add to cart → confirmation → cart
 * reflects the item — so a failure here surfaces regressions along that path.
 * We assert both the immediate modal confirmation and that the cart page
 * actually contains the line item, because a confirmation can fire while the
 * cart state silently fails to persist.
 */
test.describe('Add to cart', () => {
  test('adds a product to the cart from the listing', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    await productsPage.waitForResults();

    await productsPage.addProductToCart(0);
    await productsPage.viewCartFromModal();

    await cartPage.assertHasItems();
  });
});
