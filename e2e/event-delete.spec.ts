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

test.describe('Event Delete E2E', () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ context, page }) => {
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

    // 4. Mock layout/header metadata queries
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

    // 6. Mock current user profile
    await page.route('**/users/profile/me/**', async (route) => {
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockArtistUser),
      })
    })
  })

  test('opens delete confirmation dialog and cancels without deleting', async ({
    page,
  }) => {
    // Mock user uploaded events
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

    await page.goto('/en/profile/events')

    // 1. Locate the event card
    const eventHeading = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventHeading).toBeVisible({ timeout: 15_000 })

    // 2. Open 3-dot dropdown menu
    const menuTrigger = page.getByTestId('event-control-menu-trigger')
    await expect(menuTrigger).toBeVisible()
    await menuTrigger.click({ force: true })

    // 3. Click Delete button in dropdown
    const deleteBtn = page.getByTestId('event-control-delete-button')
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // 4. Delete confirmation dialog appears
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: /Delete "Yangon Heritage Exhibition"/i })
    ).toBeVisible()
    await expect(dialog.getByRole('paragraph')).toBeVisible()

    // 5. Click Cancel button
    const cancelBtn = dialog.getByRole('button', { name: 'Cancel', exact: true })
    await expect(cancelBtn).toBeVisible()
    await cancelBtn.click()

    // 6. Dialog closes and event remains visible on page
    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: 'Yangon Heritage Exhibition' })
    ).toBeVisible()
  })

  test('confirms deletion and successfully calls DELETE API, removing event from view', async ({
    page,
  }) => {
    let capturedDeleteMethod: string | null = null
    let capturedDeleteUrl: string | null = null
    let isDeleted = false

    // Mock dynamic events route supporting DELETE and updated GET list
    await page.route('**/artworks/events/**', async (route) => {
      const method = route.request().method()
      const url = route.request().url()

      if (method === 'DELETE' && url.includes('evt-101')) {
        capturedDeleteMethod = method
        capturedDeleteUrl = url
        isDeleted = true
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Event deleted successfully' }),
        })
      }

      if (method === 'GET' && url.includes('/events/mine')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            count: isDeleted ? 0 : 1,
            next: null,
            previous: null,
            results: isDeleted ? [] : [mockExistingEvent],
          }),
        })
      }

      return route.fallback()
    })

    await page.goto('/en/profile/events')

    // 1. Locate the event card
    const eventHeading = page.getByRole('heading', {
      name: 'Yangon Heritage Exhibition',
    })
    await expect(eventHeading).toBeVisible({ timeout: 15_000 })

    // 2. Open 3-dot dropdown menu
    const menuTrigger = page.getByTestId('event-control-menu-trigger')
    await expect(menuTrigger).toBeVisible()
    await menuTrigger.click({ force: true })

    // 3. Click Delete button in dropdown
    const deleteBtn = page.getByTestId('event-control-delete-button')
    await expect(deleteBtn).toBeVisible()
    await deleteBtn.click()

    // 4. Delete confirmation dialog appears
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: /Delete "Yangon Heritage Exhibition"/i })
    ).toBeVisible()

    // 5. Click confirm Delete button
    const confirmDeleteBtn = dialog.getByRole('button', {
      name: 'Delete',
      exact: true,
    })
    await expect(confirmDeleteBtn).toBeVisible()
    await confirmDeleteBtn.click()

    // 6. Verify DELETE API was triggered with correct event ID
    await expect
      .poll(() => capturedDeleteMethod, { timeout: 10_000 })
      .toBe('DELETE')

    expect(capturedDeleteUrl).toContain('evt-101')

    // 7. Dialog closes and deleted event is no longer rendered
    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: 'Yangon Heritage Exhibition' })
    ).not.toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('No data available')).toBeVisible({
      timeout: 10_000,
    })
  })
})
