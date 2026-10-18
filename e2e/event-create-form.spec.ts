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

const mockArtists = [
  {
    id: 101,
    first_name: 'Aung',
    last_name: 'Ko',
    username: 'aungko',
    email: 'aungko@example.com',
    user_type: 'ARTIST',
  },
  {
    id: 102,
    first_name: 'Su',
    last_name: 'Myat',
    username: 'sumyat',
    email: 'sumyat@example.com',
    user_type: 'ARTIST',
  },
]

const mockArtworks = [
  {
    id: 'art-101',
    title: 'Golden Sunset Inle',
    price: '500000',
    status: 'AVAILABLE',
  },
  {
    id: 'art-102',
    title: 'Bagan Monsoons',
    price: '800000',
    status: 'AVAILABLE',
  },
]

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

test.describe('Event Create Form E2E', () => {
  test.setTimeout(60_000)

  let capturedCreatePayload: Record<string, unknown> | null = null

  test.beforeEach(async ({ context, page }) => {
    capturedCreatePayload = null

    // 1. Authenticate user via cookies and localStorage
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

    // 2. Base API catch-all fallback
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

    // 3. Mock next-auth endpoints
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

    // 4. Mock layout/header metadata queries to avoid live network requests
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

    // 5. Mock popup events
    await page.route('**/artworks/events/popup/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      })
    })

    // 6. Mock image upload endpoint
    await page.route('**/artworks/upload-image/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          { url: 'https://picsum.photos/seed/event-uploaded/800/600.jpg' },
        ]),
      })
    })

    // 7. Mock artworks query for selection dropdown
    await page.route('**/artworks/artworks/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: mockArtworks.length,
          next: null,
          previous: null,
          results: mockArtworks,
        }),
      })
    })

    // 8. Mock artists query for selection dropdown
    await page.route('**/users/artist/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: mockArtists.length,
          next: null,
          previous: null,
          results: mockArtists,
        }),
      })
    })

    // 9. Mock current user profile
    await page.route('**/users/profile/me/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockArtistUser),
      })
    })

    // 10. Mock user uploaded events for profile events tab
    await page.route('**/artworks/events/mine/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 0, results: [] }),
      })
    })

    // 11. Mock events route: GET catalog list and POST event creation
    await page.route('**/artworks/events/**', async (route) => {
      const url = route.request().url()
      // Let popup or mine route handle their subpaths
      if (url.includes('/events/popup') || url.includes('/events/mine')) {
        return route.fallback()
      }
      const method = route.request().method()
      if (method === 'POST') {
        capturedCreatePayload = JSON.parse(route.request().postData() || '{}')
        return route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 888,
            title: capturedCreatePayload.title,
            slug: capturedCreatePayload.slug,
            event_type: capturedCreatePayload.event_type,
            about: capturedCreatePayload.about,
            cover_photo: capturedCreatePayload.cover_photo,
            event_logo: capturedCreatePayload.event_logo,
            artists: capturedCreatePayload.artists,
            artworks: capturedCreatePayload.artworks,
            start_date: capturedCreatePayload.start_date,
            end_date: capturedCreatePayload.end_date,
            is_published: capturedCreatePayload.is_published,
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
  })

  test('opens and closes event create modal from events feed page', async ({
    page,
  }) => {
    await page.goto('/en/events')

    const createBtn = page.getByTestId('header-create-event-button')
    await expect(createBtn).toBeVisible()
    await createBtn.click()

    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()
    await expect(page.getByTestId('form-dialog')).toBeVisible()

    // Close via cancel button
    const cancelBtn = page.getByTestId('form-dialog-cancel-button')
    await cancelBtn.click()
    await expect(page.getByTestId('form-dialog')).not.toBeVisible()
  })

  test('validates required fields on empty submit', async ({ page }) => {
    await page.goto('/en/events')

    await page.getByTestId('header-create-event-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()

    // Submit empty form
    const submitBtn = page.getByTestId('form-dialog-submit-button')
    await expect(submitBtn).toBeVisible()
    await submitBtn.click()

    // Assert validation error messages appear for base required fields
    await expect(
      page.getByText('Title must be at least 2 characters.')
    ).toBeVisible()
    await expect(
      page.getByText('Slug must be at least 2 characters.')
    ).toBeVisible()
    await expect(
      page.getByText('About must be at least 10 characters.')
    ).toBeVisible()
    await expect(page.getByText('Cover photo is required')).toBeVisible()
    await expect(page.getByText('Event logo is required')).toBeVisible()

    // Toggling popup promotion dynamically displays/hides date pickers
    await page.locator('#show_popup').click()
    await expect(page.locator('#popup_start')).toBeVisible()
    await expect(page.locator('#popup_end')).toBeVisible()

    await page.locator('#show_popup').click()
    await expect(page.locator('#popup_start')).not.toBeVisible()
    await expect(page.locator('#popup_end')).not.toBeVisible()
  })

  test('validates required popup dates when homepage popup promotion is enabled', async ({
    page,
  }) => {
    await page.goto('/en/events')

    await page.getByTestId('header-create-event-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()

    // Fill base required fields
    await page
      .getByPlaceholder('e.g. Modern Expressions 2026')
      .fill('Heritage Art Exhibition')
    await page
      .getByPlaceholder(
        'Provide an overview, theme, and background of this event (min 10 characters)...'
      )
      .fill('A curated exhibition exploring classical and modern artistic expressions.')

    // Upload cover photo & logo
    await page.locator('input#cover_photo').setInputFiles({
      name: 'cover.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock-cover'),
    })
    await expect(
      page.getByRole('button', { name: 'Remove image' })
    ).toBeVisible({ timeout: 10_000 })

    await page.locator('input#event_logo').setInputFiles({
      name: 'logo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock-logo'),
    })
    await expect(
      page.getByRole('button', { name: 'Remove image' })
    ).toHaveCount(2, { timeout: 10_000 })

    // Select start and end date
    await page.locator('#start_date').click()
    const calendar = page.locator('[data-slot="calendar"]')
    await expect(calendar).toBeVisible()
    await calendar.locator('button[data-day]').first().click()
    await expect(calendar).not.toBeVisible()

    await page.locator('#end_date').click()
    await expect(calendar).toBeVisible()
    await calendar.locator('button[data-day]').last().click()
    await expect(calendar).not.toBeVisible()

    // Check promote as popup without picking popup dates
    await page.locator('#show_popup').click()
    await expect(page.locator('#popup_start')).toBeVisible()
    await expect(page.locator('#popup_end')).toBeVisible()

    const submitBtn = page.getByTestId('form-dialog-submit-button')
    await submitBtn.click()

    // Assert refinement errors appear
    await expect(
      page.getByText('Popup Start Date is required when Show Popup is enabled')
    ).toBeVisible()
    await expect(
      page.getByText('Popup End Date is required when Show Popup is enabled')
    ).toBeVisible()
  })

  test('auto-generates slug from title and preserves manual slug edits', async ({
    page,
  }) => {
    await page.goto('/en/events')

    await page.getByTestId('header-create-event-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()

    const titleInput = page.getByPlaceholder('e.g. Modern Expressions 2026')
    const slugInput = page.getByPlaceholder('unique-event-slug')

    // 1. Auto slug generation
    await titleInput.fill('Yangon Modern Art Expo 2026')
    await expect(slugInput).toHaveValue('yangon-modern-art-expo-2026')

    // 2. Manual slug override
    await slugInput.fill('custom-yangon-expo-slug')
    await expect(slugInput).toHaveValue('custom-yangon-expo-slug')

    // 3. Changing title should no longer override manual slug
    await titleInput.fill('Yangon Modern Art Expo 2027')
    await expect(slugInput).toHaveValue('custom-yangon-expo-slug')
  })

  test('resets form fields when clicking reset button', async ({ page }) => {
    await page.goto('/en/events')

    await page.getByTestId('header-create-event-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()

    const titleInput = page.getByPlaceholder('e.g. Modern Expressions 2026')
    const aboutInput = page.getByPlaceholder(
      'Provide an overview, theme, and background of this event (min 10 characters)...'
    )

    await titleInput.fill('Draft Exhibition Title')
    await aboutInput.fill('Temporary about text that should be reset.')

    await expect(titleInput).toHaveValue('Draft Exhibition Title')
    await expect(aboutInput).toHaveValue(
      'Temporary about text that should be reset.'
    )

    // Click Reset
    await page.getByTestId('form-dialog-reset-button').click()

    await expect(titleInput).toHaveValue('')
    await expect(aboutInput).toHaveValue('')
  })

  test('successfully creates an event with complete submission', async ({
    page,
  }) => {
    await page.goto('/en/events')

    await page.getByTestId('header-create-event-button').click()
    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()

    // 1. Fill General Information (Title & Slug)
    await page
      .getByPlaceholder('e.g. Modern Expressions 2026')
      .fill('Visions of Mandalay')
    await expect(page.getByPlaceholder('unique-event-slug')).toHaveValue(
      'visions-of-mandalay'
    )

    // 2. Select Event Type
    await page
      .getByRole('combobox')
      .filter({ hasText: /Solo Exhibition|Select type/ })
      .click()
    const groupOption = page.getByRole('option', { name: 'Group Exhibition' })
    await expect(groupOption).toBeVisible()
    await groupOption.click()

    // 3. Fill About / Curatorial concept
    await page
      .getByPlaceholder(
        'Provide an overview, theme, and background of this event (min 10 characters)...'
      )
      .fill(
        'A comprehensive retrospective celebrating modern and contemporary expressions from Mandalay artists.'
      )

    // 4. Upload Cover Banner
    await page.locator('input#cover_photo').setInputFiles({
      name: 'banner.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock-banner-binary-data'),
    })
    await expect(
      page.getByRole('button', { name: 'Remove image' })
    ).toBeVisible({ timeout: 10_000 })

    // 5. Upload Event Logo
    await page.locator('input#event_logo').setInputFiles({
      name: 'logo.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('mock-logo-binary-data'),
    })
    // Both cover and logo are uploaded, so 2 remove buttons exist
    await expect(
      page.getByRole('button', { name: 'Remove image' })
    ).toHaveCount(2, { timeout: 10_000 })

    // 6. Select Dates (Start Date & End Date)
    await page.locator('#start_date').click()
    const calendar = page.locator('[data-slot="calendar"]')
    await expect(calendar).toBeVisible()
    await calendar.locator('button[data-day]').first().click()
    await expect(calendar).not.toBeVisible()

    await page.locator('#end_date').click()
    await expect(calendar).toBeVisible()
    await calendar.locator('button[data-day]').last().click()
    await expect(calendar).not.toBeVisible()

    // 7. Select Participating Artist
    const artistInput = page.getByPlaceholder('Search artists by name...')
    await artistInput.click()
    const artistOption = page
      .locator('[cmdk-item]')
      .filter({ hasText: 'Aung Ko' })
    await expect(artistOption).toBeVisible({ timeout: 5_000 })
    await artistOption.click()
    await expect(
      page.getByTestId('form-dialog').getByText('Aung Ko')
    ).toBeVisible()
    await page.getByText('Featured Artists & Artworks').click()

    // 8. Select Exhibited Artwork
    const artworkInput = page.getByPlaceholder('Search artworks by title...')
    await artworkInput.click()
    const artworkOption = page
      .locator('[cmdk-item]')
      .filter({ hasText: 'Golden Sunset Inle' })
    await expect(artworkOption).toBeVisible({ timeout: 5_000 })
    await artworkOption.click()
    await expect(
      page.getByTestId('form-dialog').getByText('Golden Sunset Inle')
    ).toBeVisible()
    await page.getByText('Featured Artists & Artworks').click()

    // 9. Toggle Publish Checkbox
    await page.locator('#is_published').click()

    // 10. Submit form
    const submitBtn = page.getByTestId('form-dialog-submit-button')
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // 11. Verify dispatched payload to backend
    await expect
      .poll(() => capturedCreatePayload, { timeout: 10_000 })
      .not.toBeNull()

    expect(capturedCreatePayload).toMatchObject({
      title: 'Visions of Mandalay',
      slug: 'visions-of-mandalay',
      event_type: 'GROUP',
      about:
        'A comprehensive retrospective celebrating modern and contemporary expressions from Mandalay artists.',
      cover_photo: 'https://picsum.photos/seed/event-uploaded/800/600.jpg',
      event_logo: 'https://picsum.photos/seed/event-uploaded/800/600.jpg',
      artists: [101],
      artworks: ['art-101'],
      is_published: true,
      show_popup: false,
    })
    expect(capturedCreatePayload.start_date).toBeTruthy()
    expect(capturedCreatePayload.end_date).toBeTruthy()

    // 12. Success notification toast is displayed
    await expect(page.getByText('Event Created')).toBeVisible({
      timeout: 10_000,
    })
    await expect(
      page.getByText('Event has been successfully created.')
    ).toBeVisible()

    // 13. Modal closes
    await expect(page.getByTestId('form-dialog')).not.toBeVisible({
      timeout: 10_000,
    })
  })

  test('opens event create modal from user profile events tab', async ({
    page,
  }) => {
    // Mock user uploaded events endpoint
    await page.route('**/artworks/events/mine/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ count: 0, results: [] }),
      })
    })

    await page.goto('/en/profile/events')

    const profileCreateBtn = page.getByTestId('profile-create-event-button')
    await expect(profileCreateBtn).toBeVisible({ timeout: 15_000 })
    await profileCreateBtn.click()

    await expect(
      page.getByRole('heading', { name: /Create New Event/i })
    ).toBeVisible()
    await expect(page.getByTestId('form-dialog')).toBeVisible()

    // Close dialog
    await page.getByTestId('form-dialog-cancel-button').click()
    await expect(page.getByTestId('form-dialog')).not.toBeVisible()
  })
})
