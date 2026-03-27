import { test, expect } from './fixtures';

test.describe('sign-up page', () => {
  test.setTimeout(60_000);

  test('renders and validates required fields', async ({ page }) => {
    await page.goto('/sign-up');

    await expect(page.getByRole('heading', { name: /sign up/i })).toBeVisible();

    const email = page.getByPlaceholder('Email address *');
    const firstName = page.getByPlaceholder('First Name *');
    const phone = page.getByPlaceholder('Phone *');
    const password = page.getByTitle('password');
    const confirmPassword = page.getByPlaceholder('Confirm Password *');
    const submit = page.getByRole('button', { name: /sign up/i });

    // Fill invalid values
    await email.fill('invalid-email');

    // If "First Name *" is required, leaving it empty is enough.
    // Filling '' is fine, but this makes the intent clearer.
    await firstName.fill('');
    await phone.fill('123');
    await password.fill('123');
    await confirmPassword.fill('1234');

    await submit.click();

    await expect(page.getByText(/Enter a valid email address/i)).toBeVisible();

    // "Required" might appear multiple times; if you can target a field error container
    // it’s better. Keeping broad match but using first() makes it less flaky.
    await expect(page.getByText(/Required/i).first()).toBeVisible();

    await expect(
      page.getByText(/Enter a valid Myanmar phone number/i)
    ).toBeVisible();

    await expect(
      page.getByText(/Password must be at least 6 characters/i)
    ).toBeVisible();

    await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
  });

  test('shows server error for existing account', async ({ page }) => {
    await page.route('**/api/auth/register*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          email: ['This email is already registered.'],
        }),
      });
    });

    await page.goto('/sign-up');

    await page.getByPlaceholder('Email address *').fill('user@example.com');
    await page.getByPlaceholder('First Name *').fill('Test');
    await page.getByPlaceholder('Phone *').fill('0991234567');
    await page.getByTitle('password').fill('password123');
    await page.getByPlaceholder('Confirm Password *').fill('password123');

    const submit = page.getByRole('button', { name: /sign up/i });

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/register')),
      submit.click(),
    ]);

    expect(response.status()).toBe(400);

    await expect(page.getByText(/already registered/i)).toBeVisible();
  });

  test('successful sign up redirects to sign in', async ({ page }) => {
    await page.route('**/api/auth/register*', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/sign-up');

    await page.getByPlaceholder('Email address *').fill('user@example.com');
    await page.getByPlaceholder('First Name *').fill('Test');
    await page.getByPlaceholder('Phone *').fill('0991234567');
    await page.getByTitle('password').fill('password123');
    await page.getByPlaceholder('Confirm Password *').fill('password123');

    const submit = page.getByRole('button', { name: /sign up/i });

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/register')),
      submit.click(),
    ]);

    expect([200, 201]).toContain(response.status());

    await expect(page).toHaveURL(/\/sign-in\/?$/);
  });
});
