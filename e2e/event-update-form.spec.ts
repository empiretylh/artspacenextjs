import { test, expect } from './fixtures'
import type { Event } from '../src/types'

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

const mockExistingEvent: Event = {
  id: 'evt-101',
  title: 'Yangon Heritage Exhibition',
  slug: 'yangon-heritage-exhibition',
  cover_photo: 'https://picsum.photos/seed/event-cover-orig/800/600.jpg',
  event_image: null,
  event_type: 'SOLO',
  about: 'An extensive exhibition showcasing classical Yangon modern artworks and historical artifacts.',
  artists: [
    {
      id: 101,
      first_name: 'Aung',
      last_name: 'Ko',
      username: 'aungko',
      email: 'aungko@example.com',
      user_type: 'ARTIST',
    } as any,
  ],
  artworks: [
    {
      id: 'art-101',
      title: 'Golden Sunset Inle',
      price: '500000',
      status: 'AVAILABLE',
    } as any,
  ],
  images: [],
  start_date: '2026-11-01T00:00:00.000Z',
  end_date: '2026-11-15T00:00:00.000Z',
  show_popup: false,
  popup_start: null as any,
  popup_end: null as any,
  is_published: true,
  event_logo: 'https://picsum.photos/seed/event-logo-orig/400/400.jpg',
  is_interested: false,
  interest_count: 5,
}

test.describe('Event Update Form E2E', () => {
  test.setTimeout(60_000)

  let capturedPatchPayload: Record<string, unknown> | null = null

  test.beforeEach(async ({ context, page }) => {
    capturedPatchPayload = null

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
          { url: 'https://picsum.photos/seed/event-updated/800/600.jpg' },
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

    // 10. Mock user-uploaded events list (profile events tab)
    await page.route('**/artworks/events/mine/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          count: 1,
          next: null,
          previous: null,
          results: [mockExistingEvent],
        }),
      })
    })

    // 11. Mock event detail & PATCH update endpoint
    await page.route('**/artworks/events/evt-101/**', async (route) => {
      const method = route.request().method()
      if (method === 'PATCH') {
        capturedPatchPayload = JSON.parse(route.request().postData() || '{}')
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            ...mockExistingEvent,
            ...capturedPatchPayload,
          }),
        })
      }
      if (method === 'GET') {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockExistingEvent),
        })
      }
      return route.fallback()
    })
  })

  test('opens event update modal pre-populated with existing event data', async ({
    page,
  }) => {
    await page.goto('/en/profile/events')

    // Wait for the event card to appear
    const eventCard = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventCard).toBeVisible({ timeout: 15_000 })

    // Open options dropdown menu
    const menuTrigger = page.getByTestId('event-control-menu-trigger')
    await expect(menuTrigger).toBeVisible()
    await menuTrigger.click()

    // Click Edit button
    const editBtn = page.getByTestId('event-control-edit-button')
    await expect(editBtn).toBeVisible()
    await editBtn.click()

    // Modal opens
    await expect(
      page.getByRole('heading', { name: /Update Event/i })
    ).toBeVisible({ timeout: 10_000 })
    await expect(page.getByTestId('form-dialog')).toBeVisible()

    // Verify pre-populated fields
    const titleInput = page.getByPlaceholder('e.g. Modern Expressions 2026')
    const slugInput = page.getByPlaceholder('unique-event-slug')
    const aboutInput = page.getByPlaceholder(
      'Provide an overview, theme, and background of this event (min 10 characters)...'
    )

    await expect(titleInput).toHaveValue('Yangon Heritage Exhibition')
    await expect(slugInput).toHaveValue('yangon-heritage-exhibition')
    await expect(aboutInput).toHaveValue(
      'An extensive exhibition showcasing classical Yangon modern artworks and historical artifacts.'
    )

    // Verify existing event type
    await expect(
      page.getByRole('combobox').filter({ hasText: 'Solo Exhibition' })
    ).toBeVisible()

    // Verify existing tagged artist & artwork
    await expect(
      page.getByTestId('form-dialog').getByText('Aung Ko')
    ).toBeVisible()
    await expect(
      page.getByTestId('form-dialog').getByText('Golden Sunset Inle')
    ).toBeVisible()

    // Verify existing images display remove buttons (cover photo and event logo)
    await expect(
      page.getByRole('button', { name: 'Remove image' })
    ).toHaveCount(2)

    // Verify publication status checkbox is checked
    await expect(page.locator('#is_published')).toBeChecked()
  })

  test('closes event update modal on cancel without modifying data', async ({
    page,
  }) => {
    await page.goto('/en/profile/events')

    const eventCard = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventCard).toBeVisible({ timeout: 15_000 })

    await page.getByTestId('event-control-menu-trigger').click()
    await page.getByTestId('event-control-edit-button').click()

    await expect(
      page.getByRole('heading', { name: /Update Event/i })
    ).toBeVisible({ timeout: 10_000 })

    // Cancel modal
    const cancelBtn = page.getByTestId('form-dialog-cancel-button')
    await cancelBtn.click()

    await expect(page.getByTestId('form-dialog')).not.toBeVisible()
  })

  test('validates required popup dates when homepage popup promotion is enabled on update', async ({
    page,
  }) => {
    await page.goto('/en/profile/events')

    const eventCard = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventCard).toBeVisible({ timeout: 15_000 })

    await page.getByTestId('event-control-menu-trigger').click()
    await page.getByTestId('event-control-edit-button').click()

    await expect(
      page.getByRole('heading', { name: /Update Event/i })
    ).toBeVisible({ timeout: 10_000 })

    // Enable homepage popup promotion without picking dates
    await page.locator('#show_popup').click()
    await expect(page.locator('#popup_start')).toBeVisible()
    await expect(page.locator('#popup_end')).toBeVisible()

    // Submit form
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

  test('auto-generates slug on title change and respects manual slug override', async ({
    page,
  }) => {
    await page.goto('/en/profile/events')

    const eventCard = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventCard).toBeVisible({ timeout: 15_000 })

    await page.getByTestId('event-control-menu-trigger').click()
    await page.getByTestId('event-control-edit-button').click()

    await expect(
      page.getByRole('heading', { name: /Update Event/i })
    ).toBeVisible({ timeout: 10_000 })

    const titleInput = page.getByPlaceholder('e.g. Modern Expressions 2026')
    const slugInput = page.getByPlaceholder('unique-event-slug')

    // 1. Updating title auto-updates slug
    await titleInput.fill('Mandalay Contemporary Biennial')
    await expect(slugInput).toHaveValue('mandalay-contemporary-biennial')

    // 2. Manually editing slug
    await slugInput.fill('mandalay-biennial-custom')
    await expect(slugInput).toHaveValue('mandalay-biennial-custom')

    // 3. Modifying title again retains the manual slug override
    await titleInput.fill('Mandalay Contemporary Triennial')
    await expect(slugInput).toHaveValue('mandalay-biennial-custom')
  })

  test('successfully modifies event fields and dispatches PATCH request', async ({
    page,
  }) => {
    await page.goto('/en/profile/events')

    const eventCard = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventCard).toBeVisible({ timeout: 15_000 })

    await page.getByTestId('event-control-menu-trigger').click()
    await page.getByTestId('event-control-edit-button').click()

    await expect(
      page.getByRole('heading', { name: /Update Event/i })
    ).toBeVisible({ timeout: 10_000 })

    // 1. Modify Title & Slug
    const titleInput = page.getByPlaceholder('e.g. Modern Expressions 2026')
    await titleInput.fill('Yangon Modern Expressions 2027')
    await expect(page.getByPlaceholder('unique-event-slug')).toHaveValue(
      'yangon-modern-expressions-2027'
    )

    // 2. Change Event Type to Group Exhibition
    await page
      .getByRole('combobox')
      .filter({ hasText: /Solo Exhibition/ })
      .click()
    const groupOption = page.getByRole('option', { name: 'Group Exhibition' })
    await expect(groupOption).toBeVisible()
    await groupOption.click()

    // 3. Modify About / Concept
    const aboutInput = page.getByPlaceholder(
      'Provide an overview, theme, and background of this event (min 10 characters)...'
    )
    await aboutInput.fill(
      'An updated comprehensive retrospective celebrating Burmese modern masterworks.'
    )

    // 4. Submit form
    const submitBtn = page.getByTestId('form-dialog-submit-button')
    await expect(submitBtn).toBeEnabled()
    await submitBtn.click()

    // 5. Verify captured PATCH payload
    await expect
      .poll(() => capturedPatchPayload, { timeout: 10_000 })
      .not.toBeNull()

    expect(capturedPatchPayload).toMatchObject({
      title: 'Yangon Modern Expressions 2027',
      slug: 'yangon-modern-expressions-2027',
      event_type: 'GROUP',
      about:
        'An updated comprehensive retrospective celebrating Burmese modern masterworks.',
    })

    // 6. Verify toast notification and modal closure
    await expect(page.getByText('Event updated successfully')).toBeVisible({
      timeout: 10_000,
    })
    await expect(page.getByTestId('form-dialog')).not.toBeVisible({
      timeout: 10_000,
    })
  })
})
