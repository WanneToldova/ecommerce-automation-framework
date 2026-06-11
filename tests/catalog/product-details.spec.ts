import { test } from '../../src/fixtures/pages.fixture';
import { SEARCH_TERMS } from '../../src/data/test-data';

// The product page is where people decide to buy, so the essentials (name and
// price) have to be there. I get to it the way a shopper does — search, then
// open a product — so this also covers the hand-off from the listing to the PDP.
test.describe('Product details page', () => {
  test('displays the core product information', async ({ productsPage, productPage }) => {
    await productsPage.open();
    await productsPage.search(SEARCH_TERMS.withResults);
    await productsPage.waitForResults();

    await productsPage.viewProduct(0);

    await productPage.assertLoaded();
  });
});
