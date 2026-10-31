import { test, expect } from './fixtures';

const mockBuyerUser = {
  id: 1,
  email: 'buyer@example.com',
  first_name: 'Test',
  last_name: 'Buyer',
  user_type: 'BUYER',
  profile: null,
};

test.describe('Sign-in Page', () => {
  test.setTimeout(60_000);

  test('renders form elements and validates required / invalid fields', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    // Header and subtitle
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 20_000,
    });
    await expect(
      page.getByText(/sign in to connect with artists and explore collections/i)
    ).toBeVisible();

    // Locators
    const emailInput = page.getByLabel(/email address/i);
    const passwordInput = page.getByLabel(/^password/i);
    const submitBtn = page.getByRole('button', { name: /^sign in$/i });
    const signUpLink = page.getByRole('link', { name: /sign up/i });

    await expect(emailInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(signUpLink).toBeVisible();

    // Submit invalid inputs
    await emailInput.fill('invalid-email');
    await expect(emailInput).toHaveValue('invalid-email');
    await passwordInput.fill('123');
    await expect(passwordInput).toHaveValue('123');
    await submitBtn.click();

    // Field validation error messages
    await expect(
      page.getByText(/enter a valid email address/i)
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/password must be at least 5 characters/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test('toggles password visibility', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 20_000,
    });
    const submitBtn = page.getByRole('button', { name: /^sign in$/i });
    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    await passwordInput.fill('secretpassword');
    await expect(passwordInput).toHaveValue('secretpassword');

    // Default type is password
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Click toggle button (Show password)
    const toggleButton = page.getByRole('button', { name: /^show password$/i });
    await expect(toggleButton).toBeVisible();
    await toggleButton.click();

    // Type changes to text
    await expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to toggle back to password (Hide password)
    const hideButton = page.getByRole('button', { name: /^hide password$/i });
    await expect(hideButton).toBeVisible();
    await hideButton.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('displays session expired alert when reason query param is present', async ({ page }) => {
    await page.goto('/sign-in?reason=session_expired', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByText(/your session expired\. please sign in again to continue\./i)
    ).toBeVisible({ timeout: 20_000 });
  });

  test('shows server error message for invalid credentials', async ({ page }) => {
    await page.route('**/api/auth/login*', async (route) => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          non_field_errors: ['Invalid email or password'],
        }),
      });
    });

    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 20_000,
    });

    const emailInput = page.getByRole('textbox', { name: /email address/i });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const submitBtn = page.getByRole('button', { name: /^sign in$/i });

    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    await emailInput.fill('user@example.com');
    await expect(emailInput).toHaveValue('user@example.com');
    await passwordInput.fill('wrongpassword');
    await expect(passwordInput).toHaveValue('wrongpassword');

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/login')),
      submitBtn.click(),
    ]);

    expect(response.status()).toBe(400);

    // Root error banner rendered above the form
    await expect(
      page.getByText(/invalid email or password/i).first()
    ).toBeVisible({ timeout: 10_000 });
  });

  test('successful login redirects to home by default', async ({ page, context }) => {
    await page.route('**/api/auth/login*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mock-access-token',
          firebaseToken: '',
          user: mockBuyerUser,
        }),
      });
    });

    await page.route('**/api/auth/refresh*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mock-access-token',
        }),
      });
    });

    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 20_000,
    });

    const emailInput = page.getByRole('textbox', { name: /email address/i });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const submitBtn = page.getByRole('button', { name: /^sign in$/i });

    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    await emailInput.fill('buyer@example.com');
    await expect(emailInput).toHaveValue('buyer@example.com');
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');

    // Add session cookie to simulate server-side session persistence
    await context.addCookies([
      {
        name: 'artspace_auth_session',
        value: JSON.stringify({ accessToken: 'mock-access-token', user: mockBuyerUser }),
        domain: 'localhost',
        path: '/',
      },
    ]);

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/login')),
      submitBtn.click(),
    ]);

    expect(response.status()).toBe(200);

    // Should redirect to root home / or /en
    await expect(page).toHaveURL(/\/(en)?\/?$/, { timeout: 15_000 });
  });

  test('successful login redirects to returnTo parameter if specified', async ({ page, context }) => {
    await page.route('**/api/auth/login*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mock-access-token',
          firebaseToken: '',
          user: mockBuyerUser,
        }),
      });
    });

    await page.route('**/api/auth/refresh*', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mock-access-token',
        }),
      });
    });

    await page.goto('/sign-in?return=/search', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 20_000,
    });

    const emailInput = page.getByRole('textbox', { name: /email address/i });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const submitBtn = page.getByRole('button', { name: /^sign in$/i });

    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    await emailInput.fill('buyer@example.com');
    await expect(emailInput).toHaveValue('buyer@example.com');
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');

    await context.addCookies([
      {
        name: 'artspace_auth_session',
        value: JSON.stringify({ accessToken: 'mock-access-token', user: mockBuyerUser }),
        domain: 'localhost',
        path: '/',
      },
    ]);

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/login')),
      submitBtn.click(),
    ]);

    expect(response.status()).toBe(200);

    // Should redirect to returnTo path
    await expect(page).toHaveURL(/\/search\/?$/, { timeout: 15_000 });
  });

  test('navigates to sign-up page when clicking sign-up link', async ({ page }) => {
    await page.goto('/sign-in', { waitUntil: 'domcontentloaded' });

    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible({
      timeout: 20_000,
    });

    const signUpLink = page.getByRole('link', { name: /sign up/i });
    await expect(signUpLink).toBeVisible();

    await Promise.all([
      page.waitForURL(/.*sign-up.*/, { timeout: 15_000 }),
      signUpLink.click(),
    ]);

    await expect(page).toHaveURL(/\/sign-up\/?$/);
  });
});
