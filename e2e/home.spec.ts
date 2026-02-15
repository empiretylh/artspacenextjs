import { test, expect } from './fixtures';

test('home page smoke - key sections render', async ({ page }) => {
  test.setTimeout(60000);
  await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 60000 });

  await expect(
    page.getByRole('heading', { name: /Shop Paintings by Genre/i })
  ).toBeVisible({ timeout: 15000 });
  await expect(
    page.getByRole('heading', { name: /Shop Paintings by Category And Style/i })
  ).toBeVisible({ timeout: 15000 });

  await expect(page.getByRole('heading', { name: /^Artists$/i })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByRole('heading', { name: /^Artworks$/i })).toBeVisible({
    timeout: 15000,
  });
  await expect(page.getByRole('heading', { name: /^Galleries$/i })).toBeVisible({
    timeout: 15000,
  });
  await expect(
    page.getByRole('heading', { name: /^Collectors$/i })
  ).toBeVisible({ timeout: 15000 });

  const eventsHeading = page.getByRole('heading', { name: /^Events$/i });
  if ((await eventsHeading.count()) > 0) {
    await expect(eventsHeading.first()).toBeVisible({ timeout: 15000 });
  }
});
