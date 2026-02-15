import { test, expect } from './fixtures';

test.describe('artworks page', () => {
  test.setTimeout(60_000);

  test('smoke', async ({ page }) => {
    await page.goto('/artworks');

    await expect(page.getByRole('heading', { name: /^Artworks$/i })).toBeVisible({
      timeout: 15_000,
    });

    const cards = page.getByTestId('artwork-card');
    const emptyState = page.getByText(/No results found/i);

    // Wait until either cards show up OR the empty state shows up (avoids flake)
    await Promise.race([
      expect(cards.first()).toBeVisible({ timeout: 15_000 }).catch(() => undefined),
      expect(emptyState).toBeVisible({ timeout: 15_000 }).catch(() => undefined),
    ]);

    const count = await cards.count();
    if (count > 0) {
      await expect(cards.first()).toBeVisible();
    } else {
      await expect(emptyState).toBeVisible();
    }
  });

  test('sorting updates URL', async ({ page }) => {
    await page.goto('/artworks');

    const sortTrigger = page.getByTestId('artworks-sort-select');

    await expect(sortTrigger).toBeVisible({ timeout: 15_000 });
    await sortTrigger.click();

    const createdDesc = page.getByTestId('sort-created-desc');
    await expect(createdDesc).toBeVisible({ timeout: 15_000 });
    await createdDesc.click();

    await expect(page).toHaveURL(/(?:\?|&)sort=created_at-desc(?:&|$)/, {
      timeout: 15_000,
    });

    await sortTrigger.click();

    const priceAsc = page.getByTestId('sort-price-asc');
    await expect(priceAsc).toBeVisible({ timeout: 15_000 });
    await priceAsc.click();

    await expect(page).toHaveURL(/(?:\?|&)sort=price-asc(?:&|$)/, {
      timeout: 15_000,
    });
  });

  test('filters update URL and can be cleared', async ({ page }) => {
    await page.goto('/artworks');

    const categoryTrigger = page.getByTestId('artworks-filter-category');
    await expect(categoryTrigger).toBeVisible({ timeout: 15_000 });
    await categoryTrigger.click();

    const options = page.locator('[role="option"]');

    // Don’t "return" and silently pass: either options appear, or we fail with a useful message.
    await expect(options.first()).toBeVisible({ timeout: 15_000 });

    await options.first().click();

    await expect(page).toHaveURL(/(?:\?|&)category=[^&]+/, { timeout: 15_000 });
    await expect(page.getByText(/SearchBy:/i)).toBeVisible({ timeout: 15_000 });

    const clearAll = page.getByRole('button', { name: /clear all/i });
    await expect(clearAll).toBeVisible({ timeout: 15_000 });
    await clearAll.click();

    await expect(page).not.toHaveURL(/(?:\?|&)category=/, { timeout: 15_000 });
  });

  test('sidebar opens', async ({ page }) => {
    await page.goto('/artworks');

    const filtersButton = page.getByRole('button', { name: /filters/i });
    await expect(filtersButton).toBeVisible({ timeout: 15_000 });
    await filtersButton.click();

    await expect(page.getByRole('heading', { name: /^Filters$/i })).toBeVisible({
      timeout: 15_000,
    });
  });

  test('infinite scroll sentinel reacts', async ({ page, mockArtworks }) => {
    await mockArtworks({ pageSize: 2, total: 10, delayMs: 200 });
    await page.goto('/artworks?limit=2');

    const cards = page.getByTestId('artwork-card');
    await expect(cards).toHaveCount(2, { timeout: 15_000 });

    const loadMore = page.getByText('LoadMore', { exact: true });
    const loadingMore = page.getByText(/Loading more/i);

    await Promise.race([
      loadMore.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined),
      loadingMore.waitFor({ state: 'visible', timeout: 15_000 }).catch(() => undefined),
    ]);

    if ((await loadMore.count()) > 0) {
      await loadMore.scrollIntoViewIfNeeded();
    } else {
      await cards.last().scrollIntoViewIfNeeded();
    }

    await expect(cards).toHaveCount(4, { timeout: 15_000 });
  });
});
