import { test, expect } from './fixtures'

const mockAuthSession = {
  user: {
    id: 1,
    email: 'buyer@example.com',
    first_name: 'Test',
    last_name: 'Buyer',
    user_type: 'BUYER',
  },
  accessToken: 'mock-jwt-token',
}

const mockDeliveryCharges = [
  { id: 1, city: 'Mandalay', charges: '5000.00' },
  { id: 2, city: 'Yangon', charges: '3000.00' },
]

const mockSavedAddress1 = {
  id: 101,
  label: 'Home',
  name: 'Eren Yeager',
  phone_number: '0912345678',
  shipping_address: '27 Adair Avenue',
  city: 'Mandalay',
  description: 'Ring the bell twice',
  is_default: true,
  created_at: '2026-01-01T00:00:00Z',
  updated_at: '2026-01-01T00:00:00Z',
}

const mockArtwork = {
  id: '1754a4cf-8325-4d7c-aca1-d1924e0181be',
  title: 'Golden Sunset over Irrawaddy',
  price: '10000.00',
  currency: {
    code: 'MMK',
    name: 'Myanmar Kyat',
    symbol: 'K',
    numeric_code: '104',
  },
  image: 'https://picsum.photos/seed/artwork/600/400',
  artist_name: 'Min Wae Aung',
  artist_profile: {
    first_name: 'Min',
    last_name: 'Wae Aung',
  },
  status: 'AVAILABLE',
}

test.describe('Customer Checkout Details & Address Book', () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ context, page }) => {
    // 1. Set authentication cookies for both server components and client
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

    // 2. Mock next-auth refresh & session endpoints
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

    // 3. Centralized backend API mocking for api/v1
    await page.route('**/api/v1/**', async (route) => {
      const url = route.request().url()

      // Let per-test routes handle customer-details and artworks
      if (url.includes('customer-details') || url.includes('artworks')) {
        return route.fallback()
      }

      if (url.includes('users/profile/me')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 1,
            email: 'buyer@example.com',
            first_name: 'Test',
            last_name: 'Buyer',
            user_type: 'BUYER',
            profile: {
              bio: '',
              about: '',
              profile_picture: null,
              cover_photo: null,
            },
          }),
        })
      }

      if (url.includes('orders/delivery-charges')) {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockDeliveryCharges),
        })
      }

      // Catch-all for any other backend calls (notifications, analytics, etc.)
      return route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      })
    })
  })

  test.describe('Settings - Saved Delivery Addresses Card', () => {
    test('renders address book, selects "Other" preset, and adds a new address', async ({ page }) => {
      let addresses = [mockSavedAddress1]

      await page.route('**/orders/customer-details/**', async (route) => {
        const method = route.request().method()
        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(addresses),
          })
        }
        if (method === 'POST') {
          const body = JSON.parse(route.request().postData() || '{}')
          const created = {
            id: 102,
            ...body,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
          addresses = [...addresses, created]
          return route.fulfill({
            status: 201,
            contentType: 'application/json',
            body: JSON.stringify(created),
          })
        }
        return route.fallback()
      })

      await page.goto('/en/settings')

      // 1. Verify card header and existing address
      await expect(page.getByText('Saved Delivery Addresses')).toBeVisible({ timeout: 15_000 })
      await expect(page.getByText('Eren Yeager')).toBeVisible({ timeout: 15_000 })
      await expect(page.getByText('27 Adair Avenue, Mandalay')).toBeVisible()

      // 2. Open Add Address dialog
      const addBtn = page.getByRole('button', { name: /Add Address/i }).first()
      await addBtn.click()

      await expect(page.getByRole('heading', { name: /Add New Delivery Address/i })).toBeVisible()

      // 3. Test "Other" preset pill is clickable and reveals custom label input
      const otherPill = page.getByRole('button', { name: 'Other', exact: true })
      await expect(otherPill).toBeVisible()
      await otherPill.click()

      const customLabelInput = page.getByPlaceholder('e.g. Studio, Vacation Home')
      await expect(customLabelInput).toBeVisible()
      await customLabelInput.fill('Beach House')

      // 4. Fill remaining form fields
      await page.getByPlaceholder('Enter recipient full name').fill('Mikasa Ackerman')
      await page.getByPlaceholder('e.g. 0912345678').fill('0998765432')
      await page.getByPlaceholder('Detailed address (house number, street name, ward)').fill('42 Coastal Road, Shoreline')

      // 5. Select City from dropdown
      const citySelectTrigger = page.locator('button:has-text("Select city")')
      await citySelectTrigger.click()
      await page.getByRole('option', { name: /Yangon/i }).click()

      // 6. Submit
      const submitBtn = page.getByRole('button', { name: /Save Address/i })
      await submitBtn.click()

      // 7. Verify new address card appears
      await expect(page.getByText('Beach House')).toBeVisible({ timeout: 10_000 })
      await expect(page.getByText('Mikasa Ackerman')).toBeVisible()
      await expect(page.getByText('42 Coastal Road, Shoreline, Yangon')).toBeVisible()
    })

    test('can edit an existing address and set as default', async ({ page }) => {
      let addresses = [
        {
          ...mockSavedAddress1,
          is_default: false,
        },
      ]

      await page.route('**/orders/customer-details/**', async (route) => {
        const method = route.request().method()
        const url = route.request().url()

        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(addresses),
          })
        }
        if (method === 'PATCH' || (method === 'PUT' && url.includes('101'))) {
          const body = JSON.parse(route.request().postData() || '{}')
          addresses = addresses.map((a) => (a.id === 101 ? { ...a, ...body } : a))
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(addresses[0]),
          })
        }
        return route.fallback()
      })

      await page.goto('/settings')

      await expect(page.getByText('Saved Delivery Addresses')).toBeVisible({ timeout: 15_000 })

      // Click Edit button on the address card
      const editBtn = page.getByRole('button', { name: /Edit address/i }).first()
      await editBtn.click()

      await expect(page.getByRole('heading', { name: /Edit Delivery Details/i })).toBeVisible()

      // Verify pre-filled city
      await expect(page.locator('#customer-details-form')).toContainText('Mandalay')

      // Check "Set as default address"
      const defaultCheckbox = page.getByLabel(/Set as default address/i)
      await defaultCheckbox.check()

      // Submit update
      await page.getByRole('button', { name: /Update Address/i }).click()

      // Verify "Default Address" badge appears on card
      await expect(page.getByText('Default Address', { exact: true })).toBeVisible({ timeout: 10_000 })
    })

    test('can delete a saved address after confirmation', async ({ page }) => {
      let addresses = [mockSavedAddress1]

      await page.route('**/orders/customer-details/**', async (route) => {
        const method = route.request().method()
        if (method === 'GET') {
          return route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(addresses),
          })
        }
        if (method === 'DELETE') {
          addresses = []
          return route.fulfill({ status: 204 })
        }
        return route.fallback()
      })

      await page.goto('/settings')

      await expect(page.getByText('Eren Yeager')).toBeVisible({ timeout: 15_000 })

      // Click Delete button
      const deleteBtn = page.getByRole('button', { name: /Delete address/i }).first()
      await deleteBtn.click()

      // Confirm alert dialog
      await expect(page.getByRole('heading', { name: /Delete Saved Address\?/i })).toBeVisible()
      const confirmDeleteBtn = page.getByRole('alertdialog').getByRole('button', { name: /Delete/i })
      await confirmDeleteBtn.click()

      // Verify empty state is rendered
      await expect(page.getByText('No saved addresses yet')).toBeVisible({ timeout: 10_000 })
    })
  })

  test.describe('Checkout Flow - Artwork Order Page', () => {
    test.beforeEach(async ({ page }) => {
      // Mock artwork detail API
      await page.route(`**/artworks/artworks/${mockArtwork.id}/**`, async (route) => {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify(mockArtwork),
        })
      })
    })

    test('automatically selects default address and auto-fills city and form inputs', async ({ page }) => {
      await page.route('**/orders/customer-details/**', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([mockSavedAddress1]),
        })
      })

      await page.goto(`/artworks/${mockArtwork.id}/order`)

      // Verify checkout title
      await expect(page.getByRole('heading', { name: /Checkout & Delivery/i })).toBeVisible({ timeout: 15_000 })

      // Verify Saved Addresses card is selected
      await expect(page.getByText('Eren Yeager')).toBeVisible({ timeout: 15_000 })
      await expect(page.getByText('27 Adair Avenue, Mandalay')).toBeVisible()

      // Verify form inputs auto-populated
      await expect(page.getByPlaceholder('Enter your full name')).toHaveValue('Eren Yeager')
      await expect(page.getByPlaceholder('e.g. 0912345678')).toHaveValue('0912345678')
      await expect(page.getByPlaceholder('Detailed address (house number, street name, ward)')).toHaveValue('27 Adair Avenue')

      // Verify city is auto-selected to Mandalay
      const citySelect = page.locator('button:has-text("Mandalay")')
      await expect(citySelect).toBeVisible()

      // Verify delivery charges calculated in summary
      await expect(page.locator('.lg\\:col-span-5').getByText('MMK 5,000')).toBeVisible()
    })

    test('toggling "Enter new address" clears inputs and allows custom "Other" label for future checkout', async ({ page }) => {
      await page.route('**/orders/customer-details/**', async (route) => {
        return route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([mockSavedAddress1]),
        })
      })

      await page.goto(`/artworks/${mockArtwork.id}/order`)

      await expect(page.getByText('Eren Yeager')).toBeVisible({ timeout: 15_000 })

      // Click "Enter new address"
      const enterNewBtn = page.getByRole('button', { name: /Enter new address/i })
      await enterNewBtn.click()

      // Verify inputs are cleared
      await expect(page.getByPlaceholder('Enter your full name')).toHaveValue('')
      await expect(page.getByPlaceholder('e.g. 0912345678')).toHaveValue('')
      await expect(page.getByPlaceholder('Detailed address (house number, street name, ward)')).toHaveValue('')

      // Verify "Save this address for future checkouts" checkbox appears
      const saveFutureCheckbox = page.getByLabel(/Save this address for future checkouts/i)
      await expect(saveFutureCheckbox).toBeVisible()
      await saveFutureCheckbox.check()

      // Test "Other" preset label pill
      const otherLabelPill = page.getByRole('button', { name: 'Other', exact: true })
      await expect(otherLabelPill).toBeVisible()
      await otherLabelPill.click()

      const customLabelInput = page.getByPlaceholder('e.g. Studio, Vacation Home')
      await expect(customLabelInput).toBeVisible()
      await customLabelInput.fill('Art Studio')
    })
  })
})
