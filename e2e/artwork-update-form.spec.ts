import { test, expect } from './fixtures'

const mockArtistUser = {
  id: 42,
  email: 'artist@example.com',
  first_name: 'Kyaw',
  last_name: 'Min',
  username: 'kyawmin',
  user_type: 'ARTIST',
  profile: {
    bio: 'Contemporary artist based in Yangon',
    about: 'Specializing in impressionist landscapes and modern expressionism.',
    profile_picture: null,
    cover_photo: null,
    website: 'https://example.com',
    show_email: true,
    features_photos: [],
    is_following: false,
    isBlocked: false,
  },
}

const mockAuthSession = {
  user: mockArtistUser,
  accessToken: 'mock-jwt-token',
}

const mockCategories = [
  { id: 1, name: 'Painting', slug: 'painting', image: '' },
  { id: 2, name: 'Sculpture', slug: 'sculpture', image: '' },
]

const mockGenres = [
  { id: 1, name: 'Contemporary', slug: 'contemporary', image: '' },
  { id: 2, name: 'Traditional', slug: 'traditional', image: '' },
]

const mockStyles = [
  { id: 101, name: 'Impressionism', slug: 'impressionism', image: '' },
  { id: 102, name: 'Realism', slug: 'realism', image: '' },
]

const mockCurrencies = [
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
]

const mockArtwork = {
  id: 'art-existing-1',
  title: 'Original Masterpiece',
  category_name: 'Painting',
  category: { id: 1, name: 'Painting', slug: 'painting', image: '' },
  genre: { id: 1, name: 'Contemporary', slug: 'contemporary', image: '' },
  styles: [101],
  artwork_styles: [{ id: 101, name: 'Impressionism', slug: 'impressionism', image: '' }],
  image: 'https://picsum.photos/seed/artwork-original/800/600.jpg',
  original_width: 800,
  original_height: 600,
  medium: 'Oil on Canvas',
  dimensions: '50 x 70 cm',
  year: 2024,
  status: 'AVAILABLE',
  visibility: 'PRIVATE',
  hide_price: false,
  price: '350000',
  currency: { code: 'MMK', name: 'Myanmar Kyat', numeric_code: '104', symbol: 'K' },
  are_u_owner: true,
  current_owner: 42,
  current_owner_name: null,
  artist_name: 'Kyaw Min',
  description: 'An original vibrant landscape painting.',
  search_keywords: ['landscape', 'inle'],
  is_liked: false,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  current_owner_display: mockArtistUser,
  artist_profile: mockArtistUser,
}

test.describe('Artwork Update Form E2E', () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ context, page }) => {
    // 1. Authenticate user via cookies and local storage
    const sessionString = JSON.stringify(mockAuthSession)
    await context.addCookies([
      {
        name: 'artspace_auth_session',
        value: sessionString,
        url: 'http://localhost:3000',
      },
      {
        name: 'artspace_refresh_token',
        value: 'mock-refresh-token',
        url: 'http://localhost:3000',
      },
    ])

    await page.addInitScript((session) => {
      sessionStorage.setItem('artspace:firstLoadPopup', 'true')
      window.localStorage.setItem(
        'artspace-auth',
        JSON.stringify({
          state: {
            user: session.user,
            accessToken: session.accessToken,
          },
          version: 0,
        })
      )
    }, mockAuthSession)

    // 2. Mock next-auth endpoints
    await page.route('**/api/auth/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access: 'mock-jwt-token',
          accessToken: 'mock-jwt-token',
          user: mockAuthSession.user,
        }),
      })
    })

    // 3. Centralized API catch-all fallback
    await page.route('**/api/v1/**', async (route) => {
      const url = route.request().url()
      if (
        url.includes('artworks') ||
        url.includes('users') ||
        url.includes('upload-image')
      ) {
        return route.fallback()
      }
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // 4. Mock popup events
    await page.route('**/artworks/events/popup/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // 5. Mock user profile
    await page.route('**/users/profile/me/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockArtistUser),
      })
    })

    // 6. Mock user owned artworks endpoint
    await page.route('**/artworks/artworks/owned/user/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [mockArtwork],
        }),
      })
    })

    // 7. Mock form dropdowns and lookup options
    await page.route('**/artworks/categories/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCategories),
      })
    })

    await page.route('**/artworks/genres/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockGenres),
      })
    })

    await page.route('**/artworks/artwork-styles/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockStyles),
      })
    })

    await page.route('**/artworks/currencies/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockCurrencies),
      })
    })

    await page.route('**/users/artist/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [mockArtistUser],
        }),
      })
    })
  })

  test('pre-populates form, modifies fields and custody, and submits PATCH successfully', async ({
    page,
  }) => {
    let capturedPatchPayload: any = null

    // Mock PATCH mutation endpoint
    await page.route('**/artworks/artworks/art-existing-1/**', async (route) => {
      const method = route.request().method()
      if (method === 'PATCH') {
        capturedPatchPayload = JSON.parse(route.request().postData() || '{}')
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...mockArtwork,
            ...capturedPatchPayload,
          }),
        })
      }
      return route.fallback()
    })

    await page.goto('/en/profile/artworks')

    // 1. Locate the artwork card, hover over it, and open 3-dot dropdown menu without force
    const artworkHeading = page.getByRole('heading', { name: 'Original Masterpiece' })
    await expect(artworkHeading).toBeVisible({ timeout: 15_000 })
    await artworkHeading.hover()

    const menuTrigger = page.getByTestId('artwork-control-menu-trigger')
    await expect(menuTrigger).toBeVisible()
    await menuTrigger.click()

    // 2. Explicitly wait for edit button to be visible in dropdown, then click it
    const editButton = page.getByTestId('artwork-control-edit-button')
    await expect(editButton).toBeVisible()
    await editButton.click()

    // 3. Modal opens with title
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: /Update Artwork/i })
    ).toBeVisible()

    // 4. Verify initial pre-populated values
    const titleInput = page.getByPlaceholder('Artwork title')
    const mediumInput = page.getByPlaceholder('e.g. Oil on canvas, Acrylic, Digital')
    const dimensionsInput = page.getByPlaceholder('e.g. 44 x 56 cm')
    const priceInput = page.getByPlaceholder('Enter artwork price')
    const ownerCheckbox = page.locator('#are_u_owner')

    await expect(titleInput).toHaveValue('Original Masterpiece')
    await expect(mediumInput).toHaveValue('Oil on Canvas')
    await expect(dimensionsInput).toHaveValue('50 x 70 cm')
    await expect(priceInput).toHaveValue('350000')
    await expect(ownerCheckbox).toBeChecked()
    await expect(page.getByText(/Kyaw Min \(Account Owner\)/i)).toBeVisible()

    // 5. Modify Title
    await titleInput.fill('Updated Masterpiece 2026')

    // 6. Modify Price
    await priceInput.fill('650000')

    // 7. Modify Status to Sold
    await page.locator('#status').click()
    const soldOption = page.getByRole('option', { name: 'Sold', exact: true })
    await expect(soldOption).toBeVisible({ timeout: 5_000 })
    await soldOption.click()

    // 8. Switch custody to custom owner ('Yangon Heritage Gallery')
    await ownerCheckbox.uncheck()
    await expect(ownerCheckbox).not.toBeChecked()

    const customOwnerInput = page.getByPlaceholder('Name of owner or holding gallery')
    await expect(customOwnerInput).toBeVisible()
    await customOwnerInput.fill('Yangon Heritage Gallery')

    // 9. Submit changes
    const submitBtn = page.getByRole('button', { name: 'Save Changes' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // 10. Verify payload dispatched in PATCH request
    await expect
      .poll(() => capturedPatchPayload, { timeout: 10_000 })
      .not.toBeNull()

    expect(capturedPatchPayload).toMatchObject({
      title: 'Updated Masterpiece 2026',
      price: 650000,
      status: 'SOLD',
      are_u_owner: false,
      current_owner_name: 'Yangon Heritage Gallery',
    })

    // 11. Verify success notification and modal closure
    await expect(page.getByText('Artwork Updated')).toBeVisible({ timeout: 10_000 })
    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
  })
})
