import { test } from '../../src/fixtures/pages.fixture';

// Adding to the cart is the key step before checkout, and it chains the whole
// funnel together (browse -> add -> confirmation -> cart). I check both the
// confirmation modal AND that the cart page really holds the item, because I
// don't trust a toast on its own — the confirmation can fire while the cart
// state quietly fails to persist.
test.describe('Add to cart', () => {
  test('adds a product to the cart from the listing', async ({ productsPage, cartPage }) => {
    await productsPage.open();
    await productsPage.waitForResults();

    await productsPage.addProductToCart(0);
    await productsPage.viewCartFromModal();

    await cartPage.assertHasItems();
  });
});
