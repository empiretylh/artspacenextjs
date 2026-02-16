import { test, expect } from './fixtures';

test.describe('sign-in page', () => {
  test.setTimeout(60_000);

  test('renders and validates required fields', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    await expect(page.getByText(/Welcome Back/i)).toBeVisible({
      timeout: 15_000,
    });

    const email = page.getByPlaceholder('Email address');
    const password = page.getByPlaceholder('Password');
    const submit = page.getByRole('button', { name: /sign in/i });

    await email.fill('invalid-email@testing.com');
    await password.fill('123');
    await submit.click();

    await expect(
      page.getByText(/Enter a valid email address/i)
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/Password must be at least 6 characters/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test('shows server error for invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          non_field_errors: ['Invalid email or password'],
        }),
      });
    });

    await page.goto('/sign-in');

    await page.getByPlaceholder('Email address')
      .fill('invalid-email@testing.com');

    await page.getByPlaceholder('Password')
      .fill('password123');

    const [response] = await Promise.all([
      page.waitForResponse('**/api/auth/login*'),
      page.getByRole('button', { name: /sign in/i }).click(),
    ]);

    expect(response.status()).toBe(400);

    await expect(
      page.getByText(/Invalid email or password/i)
    ).toBeVisible();
  });

  test('successful login redirects to home', async ({ page }) => {
    await page.route('**/api/auth/login*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'test-token',
          user: {
            id: 1,
            email: 'user@example.com',
            first_name: 'Test',
            last_name: 'User',
            user_type: 'BUYER',
            profile: null,
          },
        }),
      });
    });

    await page.goto('/sign-in');

    await page.getByPlaceholder('Email address').fill('user@example.com');
    await page.getByPlaceholder('Password').fill('password123');

    const [response] = await Promise.all([
      page.waitForResponse('**/api/auth/login*'),
      page.getByRole('button', { name: /sign in/i }).click(),
    ]);

    expect(response.status()).toBe(200);

    await expect(page).toHaveURL(/\/?$/); // accepts / or no trailing slash
  });
});
