import { test } from '../../src/fixtures/pages.fixture';
import { SEARCH_TERMS } from '../../src/data/test-data';

/**
 * PRODUCT DETAILS PAGE (PDP)
 *
 * Why this is critical: the PDP is where the buying decision happens. It must
 * reliably present the essentials a shopper needs — name and price. We reach it
 * the way a real user does (search → open a product), so the test also
 * exercises the navigation contract between the listing and the PDP.
 */
test.describe('Product details page', () => {
  test('displays the core product information', async ({ productsPage, productPage }) => {
    await productsPage.open();
    await productsPage.search(SEARCH_TERMS.withResults);
    await productsPage.waitForResults();

    await productsPage.viewProduct(0);

    await productPage.assertLoaded();
  });
});
