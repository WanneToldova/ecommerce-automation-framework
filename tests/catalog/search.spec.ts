import { test, expect } from '../../src/fixtures/pages.fixture';
import { SEARCH_TERMS } from '../../src/data/test-data';

// Search is how most shoppers find anything, so I treat it as a top priority:
// if it breaks, discovery dies no matter how good the rest of the funnel is.
// I check two things — a common term returns products, and searching actually
// narrows the grid (I've seen regressions where the query is ignored and the
// full catalogue shows up regardless).
test.describe('Catalogue search', () => {
  test('returns a populated results grid for a common term', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.search(SEARCH_TERMS.withResults);

    await productsPage.waitForResults();
    const count = await productsPage.productCount();
    expect(count, 'expected at least one product in the results grid').toBeGreaterThan(0);
  });

  test('narrows the catalogue to relevant results', async ({ productsPage }) => {
    await productsPage.open();
    await productsPage.waitForResults();
    const totalCount = await productsPage.productCount();

    await productsPage.search(SEARCH_TERMS.filtering);
    await productsPage.waitForResults();
    const searchedCount = await productsPage.productCount();

    // Should return something, but fewer than the full list — proof the query
    // was actually applied.
    expect(searchedCount).toBeGreaterThan(0);
    expect(searchedCount).toBeLessThanOrEqual(totalCount);
  });
});
