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

test.describe('Artwork Delete E2E', () => {
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
  })

  test('opens delete confirmation dialog and cancels deletion', async ({ page }) => {
    // Mock user owned artworks endpoint
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

    await page.goto('/en/profile/artworks')

    // 1. Locate artwork card and open 3-dot dropdown menu
    await expect(page.getByText('Original Masterpiece')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('artwork-control-menu-trigger').click({ force: true })

    // 2. Click "Delete" item from dropdown
    const deleteMenuItem = page.getByTestId('artwork-control-delete-button')
    await expect(deleteMenuItem).toBeVisible()
    await deleteMenuItem.click()

    // 3. Delete confirmation dialog appears
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: /Delete "Original Masterpiece"/i })
    ).toBeVisible()
    await expect(
      dialog.getByRole('paragraph')
    ).toBeVisible()

    // 4. Click Cancel button
    const cancelButton = dialog.getByRole('button', { name: 'Cancel' })
    await expect(cancelButton).toBeVisible()
    await cancelButton.click()

    // 5. Modal closes and artwork remains on the page
    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Original Masterpiece')).toBeVisible()
  })

  test('confirms deletion and successfully calls DELETE API', async ({ page }) => {
    let capturedDeleteMethod: string | null = null
    let capturedDeleteUrl: string | null = null
    let isDeleted = false

    // Mock DELETE endpoint and dynamic GET list reflecting deleted state
    await page.route('**/artworks/artworks/**', async (route) => {
      const method = route.request().method()
      const url = route.request().url()

      if (method === 'DELETE' && url.includes('art-existing-1')) {
        capturedDeleteMethod = method
        capturedDeleteUrl = url
        isDeleted = true
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ detail: 'Artwork deleted successfully' }),
        })
      }

      if (method === 'GET' && url.includes('owned/user')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            count: isDeleted ? 0 : 1,
            next: null,
            previous: null,
            results: isDeleted ? [] : [mockArtwork],
          }),
        })
      }

      return route.fallback()
    })

    await page.goto('/en/profile/artworks')

    // 1. Locate artwork card and open 3-dot dropdown menu
    await expect(page.getByText('Original Masterpiece')).toBeVisible({ timeout: 15_000 })
    await page.getByTestId('artwork-control-menu-trigger').click({ force: true })

    // 2. Click "Delete" item from dropdown
    await page.getByTestId('artwork-control-delete-button').click()

    // 3. Delete confirmation dialog appears
    const dialog = page.getByRole('dialog')
    await expect(dialog).toBeVisible({ timeout: 10_000 })
    await expect(
      page.getByRole('heading', { name: /Delete "Original Masterpiece"/i })
    ).toBeVisible()

    // 4. Click confirm "Delete" button inside dialog
    const confirmDeleteBtn = dialog.getByRole('button', { name: 'Delete', exact: true })
    await expect(confirmDeleteBtn).toBeVisible()
    await confirmDeleteBtn.click()

    // 5. Verify DELETE API was triggered with correct artwork ID
    await expect
      .poll(() => capturedDeleteMethod, { timeout: 10_000 })
      .toBe('DELETE')

    expect(capturedDeleteUrl).toContain('art-existing-1')

    // 6. Dialog closes and deleted artwork is no longer shown
    await expect(dialog).not.toBeVisible({ timeout: 10_000 })
    await expect(page.getByText('Original Masterpiece')).not.toBeVisible({ timeout: 10_000 })
  })
})
