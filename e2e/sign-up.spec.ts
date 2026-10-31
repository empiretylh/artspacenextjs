import { test, expect } from './fixtures';

test.describe('Sign-up Page', () => {
  test.setTimeout(60_000);

  test('renders form elements and validates required / invalid fields', async ({ page }) => {
    await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });

    // Heading and subtitle
    await expect(
      page.getByRole('heading', { name: /join myanmar art space/i })
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByText(/create an account to support local artists and collect art/i)
    ).toBeVisible();

    // Locators
    const emailInput = page.getByRole('textbox', { name: /email address/i });
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    const lastNameInput = page.getByRole('textbox', { name: /last name/i });
    const userTypeTrigger = page.getByLabel('User type');
    const phoneInput = page.getByRole('textbox', { name: /phone number/i });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password', exact: true });
    const submitBtn = page.getByRole('button', { name: /^sign up$/i });
    const signInLink = page.getByRole('link', { name: /sign in/i });

    await expect(emailInput).toBeVisible();
    await expect(firstNameInput).toBeVisible();
    await expect(lastNameInput).toBeVisible();
    await expect(userTypeTrigger).toBeVisible();
    await expect(phoneInput).toBeVisible();
    await expect(passwordInput).toBeVisible();
    await expect(confirmPasswordInput).toBeVisible();
    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(signInLink).toBeVisible();

    // Fill invalid values
    await emailInput.fill('invalid-email');
    await expect(emailInput).toHaveValue('invalid-email');
    await firstNameInput.fill('');
    await phoneInput.fill('123');
    await expect(phoneInput).toHaveValue('123');
    await passwordInput.fill('123');
    await expect(passwordInput).toHaveValue('123');
    await confirmPasswordInput.fill('1234');
    await expect(confirmPasswordInput).toHaveValue('1234');

    await submitBtn.click();

    // Validation error messages
    await expect(
      page.getByText(/enter a valid email address/i)
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/required/i).first()
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/enter a valid myanmar phone number/i)
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/password must be at least 5 characters/i)
    ).toBeVisible({ timeout: 10_000 });
    await expect(
      page.getByText(/passwords do not match/i)
    ).toBeVisible({ timeout: 10_000 });
  });

  test('toggles password and confirm password visibility', async ({ page }) => {
    await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /join myanmar art space/i })
    ).toBeVisible({ timeout: 20_000 });

    const submitBtn = page.getByRole('button', { name: /^sign up$/i });
    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password', exact: true });

    await passwordInput.fill('secretpassword');
    await confirmPasswordInput.fill('secretpassword');

    // Default input types
    await expect(passwordInput).toHaveAttribute('type', 'password');
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Toggle main password
    const showPasswordBtn = page.getByRole('button', { name: /^show password$/i });
    await expect(showPasswordBtn).toBeVisible();
    await showPasswordBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'text');

    const hidePasswordBtn = page.getByRole('button', { name: /^hide password$/i });
    await expect(hidePasswordBtn).toBeVisible();
    await hidePasswordBtn.click();
    await expect(passwordInput).toHaveAttribute('type', 'password');

    // Toggle confirm password
    const showConfirmBtn = page.getByRole('button', { name: /^show confirm password$/i });
    await expect(showConfirmBtn).toBeVisible();
    await showConfirmBtn.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'text');

    const hideConfirmBtn = page.getByRole('button', { name: /^hide confirm password$/i });
    await expect(hideConfirmBtn).toBeVisible();
    await hideConfirmBtn.click();
    await expect(confirmPasswordInput).toHaveAttribute('type', 'password');
  });

  test('allows selecting account type', async ({ page }) => {
    await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /join myanmar art space/i })
    ).toBeVisible({ timeout: 20_000 });

    const submitBtn = page.getByRole('button', { name: /^sign up$/i });
    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    const userTypeTrigger = page.getByLabel('User type');
    await userTypeTrigger.click();

    // Select Artist option
    const artistOption = page.getByRole('option', { name: /artist/i });
    await expect(artistOption).toBeVisible({ timeout: 10_000 });
    await artistOption.click();

    await expect(userTypeTrigger).toContainText(/artist/i);
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

    await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /join myanmar art space/i })
    ).toBeVisible({ timeout: 20_000 });

    const emailInput = page.getByRole('textbox', { name: /email address/i });
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    const phoneInput = page.getByRole('textbox', { name: /phone number/i });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password', exact: true });
    const submitBtn = page.getByRole('button', { name: /^sign up$/i });

    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    await emailInput.fill('user@example.com');
    await expect(emailInput).toHaveValue('user@example.com');
    await firstNameInput.fill('Test');
    await expect(firstNameInput).toHaveValue('Test');
    await phoneInput.fill('0991234567');
    await expect(phoneInput).toHaveValue('0991234567');
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');
    await confirmPasswordInput.fill('password123');
    await expect(confirmPasswordInput).toHaveValue('password123');

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/register')),
      submitBtn.click(),
    ]);

    expect(response.status()).toBe(400);

    await expect(page.getByText(/already registered/i).first()).toBeVisible({
      timeout: 10_000,
    });
  });

  test('successful sign up redirects to sign in', async ({ page }) => {
    await page.route('**/api/auth/register*', async (route) => {
      await route.fulfill({
        status: 201,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /join myanmar art space/i })
    ).toBeVisible({ timeout: 20_000 });

    const emailInput = page.getByRole('textbox', { name: /email address/i });
    const firstNameInput = page.getByRole('textbox', { name: /first name/i });
    const phoneInput = page.getByRole('textbox', { name: /phone number/i });
    const passwordInput = page.getByRole('textbox', { name: 'Password', exact: true });
    const confirmPasswordInput = page.getByRole('textbox', { name: 'Confirm password', exact: true });
    const submitBtn = page.getByRole('button', { name: /^sign up$/i });

    await expect(submitBtn).toBeVisible({ timeout: 20_000 });
    await expect(submitBtn).toBeEnabled({ timeout: 20_000 });

    await emailInput.fill('newuser@example.com');
    await expect(emailInput).toHaveValue('newuser@example.com');
    await firstNameInput.fill('Test');
    await expect(firstNameInput).toHaveValue('Test');
    await phoneInput.fill('0991234567');
    await expect(phoneInput).toHaveValue('0991234567');
    await passwordInput.fill('password123');
    await expect(passwordInput).toHaveValue('password123');
    await confirmPasswordInput.fill('password123');
    await expect(confirmPasswordInput).toHaveValue('password123');

    const [response] = await Promise.all([
      page.waitForResponse((resp) => resp.url().includes('/api/auth/register')),
      submitBtn.click(),
    ]);

    expect([200, 201]).toContain(response.status());

    // Should redirect to sign-in page
    await expect(page).toHaveURL(/\/sign-in\/?$/, { timeout: 15_000 });
  });

  test('navigates to sign-in page when clicking sign-in link', async ({ page }) => {
    await page.goto('/sign-up', { waitUntil: 'domcontentloaded' });

    await expect(
      page.getByRole('heading', { name: /join myanmar art space/i })
    ).toBeVisible({ timeout: 20_000 });

    const signInLink = page.getByRole('link', { name: /sign in/i });
    await expect(signInLink).toBeVisible();

    await Promise.all([
      page.waitForURL(/.*sign-in.*/, { timeout: 15_000 }),
      signInLink.click(),
    ]);

    await expect(page).toHaveURL(/\/sign-in\/?$/);
  });
});
