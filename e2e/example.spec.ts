import { test, expect } from './fixtures';

test('home page loads', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  await expect(page).toHaveTitle(/Myanmar Art Space/i);
});

test('home page shows app brand in sidebar', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/');
  const brandLinks = page.getByRole('link', { name: /Myanmar Art Space/i });
  await expect(brandLinks.first()).toBeVisible({ timeout: 15000 });
});
