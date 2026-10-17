import { test, expect } from './fixtures'

const mockArtistUser = {
  id: 42,
  email: 'artist@example.com',
  first_name: 'Kyaw',
  last_name: 'Min',
  user_type: 'ARTIST',
  profile: {
    bio: 'Contemporary artist based in Yangon',
    about: 'Specializing in impressionist landscapes and modern expressionism.',
    profile_picture: null,
    cover_photo: null,
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
  { id: 101, name: 'Impressionism' },
  { id: 102, name: 'Realism' },
]

const mockCurrencies = [
  { code: 'MMK', name: 'Myanmar Kyat', symbol: 'K' },
  { code: 'USD', name: 'US Dollar', symbol: '$' },
]

const mockRegisteredArtists = [
  {
    id: 99,
    first_name: 'Zaw',
    last_name: 'Min',
    username: 'zawmin',
    email: 'zawmin@example.com',
    user_type: 'ARTIST',
  },
]

test.describe('Artwork Create Form E2E', () => {
  test.setTimeout(60_000)

  let capturedCreatePayload: any = null

  test.beforeEach(async ({ context, page }) => {
    capturedCreatePayload = null

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

    // 5. Unified artworks route (handles both catalog GET and creation POST without collision)
    await page.route('**/artworks/artworks/**', async (route) => {
      const method = route.request().method()
      if (method === 'POST') {
        capturedCreatePayload = JSON.parse(route.request().postData() || '{}')
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'art-created-101',
            title: capturedCreatePayload.title,
            price: String(capturedCreatePayload.price),
            status: capturedCreatePayload.status,
          }),
        })
      }
      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ count: 0, results: [] }),
        })
      }
      return route.fallback()
    })

    // 6. Mock image upload endpoint
    await page.route('**/artworks/upload-image/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { url: 'https://picsum.photos/seed/artwork-success/800/600.jpg' },
        ]),
      })
    })

    // 7. Mock metadata queries for form dropdowns & lookup
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
          count: mockRegisteredArtists.length,
          next: null,
          previous: null,
          results: mockRegisteredArtists,
        }),
      })
    })

    await page.route('**/users/profile/me/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockArtistUser),
      })
    })
  })

  test('validates required fields on empty submit', async ({ page }) => {
    await page.goto('/en/artworks')

    await page.getByTestId('header-create-artwork-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Artwork/i })
    ).toBeVisible()

    // Submit without filling any field
    const submitButton = page.getByRole('button', { name: 'Create Artwork' })
    await expect(submitButton).toBeVisible()
    await submitButton.click()

    // Verify all validation error messages on empty submit
    await expect(page.getByText('Artwork Image is required')).toBeVisible()
    await expect(page.getByText('Title must be at least 2 characters.')).toBeVisible()
    await expect(page.getByText('Category is required')).toBeVisible()
    await expect(page.getByText('Genre is required')).toBeVisible()
    await expect(page.getByText('Medium is required.')).toBeVisible()
    await expect(page.getByText('Dimension must be at least 3 characters.')).toBeVisible()
    await expect(page.getByText('Select at least one style')).toBeVisible()

    // Test price validation (entering 0 fails min(1))
    const priceInput = page.getByPlaceholder('Enter artwork price')
    await priceInput.fill('0')
    await submitButton.click()
    await expect(page.getByText('Price must be include.')).toBeVisible()
  })

  test('successfully creates artwork with complete form submission', async ({
    page,
  }) => {
    await page.goto('/en/artworks')

    await page.getByTestId('header-create-artwork-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Artwork/i })
    ).toBeVisible()

    // 1. Upload artwork image using underlying input[type="file"]
    await page.locator('input[type="file"]').setInputFiles({
      name: 'sunset-inle.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock-image-binary-data'),
    })

    // Wait for upload preview thumbnail to render (removes uploading state)
    await expect(page.getByRole('button', { name: 'Remove image' })).toBeVisible({
      timeout: 10_000,
    })

    // 2. Title
    await page.getByPlaceholder('e.g. Whispers of Inle Lake').fill('Whispers of Inle Lake')

    // 3. Category Select
    await page.locator('#category').click()
    const categoryOption = page.getByRole('option', { name: 'Painting' })
    await expect(categoryOption).toBeVisible({ timeout: 5_000 })
    await categoryOption.click()

    // 4. Genre Select
    await page.locator('#genre').click()
    const genreOption = page.getByRole('option', { name: 'Contemporary' })
    await expect(genreOption).toBeVisible({ timeout: 5_000 })
    await genreOption.click()

    // 5. Medium & Dimensions
    await page
      .getByPlaceholder('e.g. Oil on canvas, Acrylic, Digital')
      .fill('Oil on Canvas')
    await page.getByPlaceholder('e.g. 44 x 56 cm').fill('60 x 80 cm')

    // 6. Styles (MultipleSelector)
    const styleInput = page.getByPlaceholder(
      'Select styles (e.g. Contemporary, Impressionism)...'
    )
    await styleInput.click()
    const styleOption = page.locator('[cmdk-item]').filter({ hasText: 'Impressionism' })
    await expect(styleOption).toBeVisible({ timeout: 5_000 })
    await styleOption.click()
    await expect(page.getByTestId('form-dialog').getByText('Impressionism')).toBeVisible()

    // Close style selector popover safely via a safe background click on the dialog header
    await page.getByRole('heading', { name: /Create New Artwork/i }).click()

    // 7. Status & Visibility
    // Status is AVAILABLE by default, Visibility is PRIVATE by default. Change visibility to PUBLIC
    await page.locator('#visibility').click()
    const visibilityOption = page.getByRole('option', {
      name: /Public \(Visible to everyone\)/i,
    })
    await expect(visibilityOption).toBeVisible({ timeout: 5_000 })
    await visibilityOption.click()

    // 8. Price
    await page.getByPlaceholder('Enter artwork price').fill('450000')

    // 9. Artist Name (custom name attribution)
    await page.getByPlaceholder("Artist's full name").fill('Min Wae Aung')

    // 10. Description
    await page
      .getByPlaceholder('Describe the background, inspiration, or story behind this artwork...')
      .fill('A serene depiction of fishermen and morning mist over Inle Lake.')

    // 11. Search keywords
    const tagsInput = page.getByPlaceholder('Add keywords and press Enter')
    await tagsInput.fill('inle')
    await tagsInput.press('Enter')
    await tagsInput.fill('landscape')
    await tagsInput.press('Enter')

    // 12. Submit the form
    const submitBtn = page.getByRole('button', { name: 'Create Artwork' })
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // 13. Verify payload dispatched to backend
    await expect
      .poll(() => capturedCreatePayload, { timeout: 10_000 })
      .not.toBeNull()

    expect(capturedCreatePayload).toMatchObject({
      title: 'Whispers of Inle Lake',
      category: 1,
      genre: 1,
      medium: 'Oil on Canvas',
      dimensions: '60 x 80 cm',
      styles_artwork_ids: '101',
      image: 'https://picsum.photos/seed/artwork-success/800/600.jpg',
      status: 'AVAILABLE',
      visibility: 'PUBLIC',
      price: 450000,
      currency: 'MMK',
      are_u_owner: true,
      current_owner: 42,
      artist_name: 'Min Wae Aung',
      description: 'A serene depiction of fishermen and morning mist over Inle Lake.',
    })
    expect(capturedCreatePayload.search_keywords).toEqual(
      expect.arrayContaining(['inle', 'landscape'])
    )

    // 14. Success notification toast is shown
    await expect(page.getByText('Artwork Created')).toBeVisible({ timeout: 10_000 })

    // 15. Modal closes after successful submission
    await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10_000 })
  })
})
