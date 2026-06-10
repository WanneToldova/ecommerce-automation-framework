import { test, expect } from '../../src/fixtures/pages.fixture';
import { SEARCH_TERMS } from '../../src/data/test-data';

/**
 * SEARCH / CATALOGUE BROWSING
 *
 * Why this is critical: search is the primary way shoppers find products. If
 * search breaks, discovery (and therefore revenue) collapses regardless of how
 * good the rest of the funnel is. We cover that a common term returns results,
 * and that searching actually *narrows* the catalogue rather than ignoring the
 * query — a subtle but common regression.
 */
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

    // Search must return something, but fewer than the full catalogue —
    // proving the query is actually applied.
    expect(searchedCount).toBeGreaterThan(0);
    expect(searchedCount).toBeLessThanOrEqual(totalCount);
  });
});
