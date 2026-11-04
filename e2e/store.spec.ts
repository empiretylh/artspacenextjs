import { test, expect } from './fixtures'

const ARTWORK_ID = '1754a4cf-8325-4d7c-aca1-d1924e0181be'
const PRODUCT_ID = 'b1f0e2a4-6d3c-4f8a-9e2b-1c7d5a3f8e90'
const TYPE_ID = 'c7d3a1b9-4e2f-4c8a-b6d1-9f0e2a4c6d8b'
const VARIANT_ID = 'd8e4b2c0-5f3a-4d9b-a7e2-0a1f3b5d7e9c'
const MERCH_ORDER_ID = 'e9f5c3d1-6a4b-4eac-b8f3-1b2a4c6e8f0d'

const mockUser = {
  id: 1,
  email: 'buyer@example.com',
  first_name: 'Test',
  last_name: 'Buyer',
  user_type: 'BUYER',
  profile: { bio: '', about: '', profile_picture: null, cover_photo: null },
}

const mockAuthSession = { user: mockUser, accessToken: 'mock-jwt-token' }

const mockProductType = {
  id: TYPE_ID,
  name: 'Classic T-Shirt',
  slug: 'classic-t-shirt',
  category: 'APPAREL',
  base_price: '39000.00',
  currency: 'MMK',
  default_royalty_percent: '10.00',
  preview_config: { print_area: { x: 0.3, y: 0.22, w: 0.4, h: 0.42 } },
  is_colorable: true,
  is_active: true,
  sort_order: 0,
}

const mockVariant = {
  id: VARIANT_ID,
  color_name: 'Black',
  color_hex: '#1A1B22',
  size: 'L',
  sku: 'TEE-BLK-L',
  price_modifier: '0.00',
  stock: null,
  mockup_asset: null,
  mockup_url: null,
  price: '39000.00',
  is_active: true,
  sort_order: 0,
}

const mockProduct = {
  id: PRODUCT_ID,
  title: 'Rice Fields - Classic T-Shirt',
  slug: 'rice-fields-classic-t-shirt',
  description: 'Organic cotton tee printed with the painting.',
  product_type: mockProductType,
  artwork: ARTWORK_ID,
  artwork_title: 'Rice Fields',
  artwork_image_url: 'https://cdn.example.com/artworks/rice-fields.jpg',
  artist: 5,
  artist_name: 'Thura Lin',
  hero_asset: null,
  hero_url: null,
  price: '39000.00',
  price_override: null,
  currency: 'MMK',
  royalty_percent: '10.00',
  preview_config: { print_area: { x: 0.3, y: 0.22, w: 0.4, h: 0.42 } },
  is_colorable: true,
  variants: [mockVariant],
  is_published: true,
  created_at: '2026-10-01T00:00:00Z',
  updated_at: '2026-10-01T00:00:00Z',
}

/**
 * Exactly what OrderSerializer returns for a MERCH order: artwork is null,
 * `items` is empty, and store_lines carry frozen snapshots. An order screen that
 * reads `items` alone shows nothing here, which is the bug this suite guards.
 */
const mockMerchOrder = {
  id: MERCH_ORDER_ID,
  buyer: mockUser,
  owner: 'store@myanmarartspace.net',
  order_type: 'MERCH',
  artwork: null,
  price: '39000.00',
  currency: 'MMK',
  tax: '0.00',
  deli_fee: '3000.00',
  total_price: '42000.00',
  name: 'Test Buyer',
  shipping_address: '27 Adair Avenue, Yangon',
  phone_number: '0912345678',
  description: '',
  order_status: 'PENDING',
  payment_status: 'PENDING',
  status: 'PENDING',
  created_at: '2026-10-02T00:00:00Z',
  updated_at: '2026-10-02T00:00:00Z',
  items: [],
  store_lines: [
    {
      id: 1,
      product: PRODUCT_ID,
      variant: VARIANT_ID,
      product_title: 'Rice Fields - Classic T-Shirt',
      product_type_name: 'Classic T-Shirt',
      variant_sku: 'TEE-BLK-L',
      color_name: 'Black',
      color_hex: '#1A1B22',
      size: 'L',
      unit_price: '39000.00',
      currency_code: 'MMK',
      quantity: 1,
      line_total: '39000.00',
      artwork_id_snapshot: ARTWORK_ID,
      artwork_title: 'Rice Fields',
      artist_name: 'Thura Lin',
      thumbnail_key: 'artworks/rice-fields.jpg',
      thumbnail_url: 'https://cdn.example.com/artworks/rice-fields.jpg',
      royalty_percent: '10.00',
      royalty_amount: '3900.00',
    },
  ],
}

const json = (route: any, body: unknown, status = 200) =>
  route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

/**
 * Matched on pathname, never on a substring of the URL: `/store/products/` and
 * `/store/products/<uuid>/` both contain `store/products/`, so a substring
 * matcher hands the detail screen a list payload and the page renders an empty
 * product with a zero price.
 */
let merchOrderPayload: Record<string, unknown> | null = null

test.describe('MAS Store', () => {
  test.setTimeout(60_000)

  test.beforeEach(async ({ context, page }) => {
    merchOrderPayload = null

    await context.addCookies([
      {
        name: 'artspace_auth_session',
        value: JSON.stringify(mockAuthSession),
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
        JSON.stringify({ state: { user: session.user, accessToken: session.accessToken }, version: 0 })
      )
    }, mockAuthSession)

    await page.route('**/api/auth/**', (route) => json(route, { ...mockAuthSession, access: 'mock-jwt-token' }))

    await page.route('**/api/v1/**', (route) => {
      const path = new URL(route.request().url()).pathname
      const method = route.request().method()

      if (path.endsWith('/users/profile/me/') || path.includes('/users/profile/')) {
        return json(route, mockUser)
      }
      if (path === '/api/v1/store/products/' && method === 'GET') {
        return json(route, { results: [mockProduct], count: 1 })
      }
      if (path === `/api/v1/store/products/${PRODUCT_ID}/`) return json(route, mockProduct)
      if (path === '/api/v1/store/product-types/') {
        return json(route, { results: [mockProductType], count: 1 })
      }
      if (path === '/api/v1/store/orders/' && method === 'POST') {
        merchOrderPayload = route.request().postDataJSON()
        return json(route, mockMerchOrder, 201)
      }
      if (path === `/api/v1/orders/orders/${MERCH_ORDER_ID}/`) return json(route, mockMerchOrder)
      if (path.includes('orders/delivery-charges')) {
        return json(route, [{ id: 2, city: 'Yangon', charges: '3000.00' }])
      }
      if (path.includes('orders/customer-details')) return json(route, [])

      // Anything else the shell asks for must not reach a real backend.
      return json(route, { results: [], count: 0 })
    })
  })

  test('browse lists items under their product type', async ({ page }) => {
    await page.goto('/en/store')

    await expect(page.getByRole('heading', { level: 2, name: 'Classic T-Shirt' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Rice Fields - Classic T-Shirt/ }).first()).toBeVisible()
  })

  test('product detail renders the preview, colourway and Buy Now', async ({ page }) => {
    await page.goto(`/en/store/products/${PRODUCT_ID}`)

    await expect(page.getByRole('heading', { level: 1, name: 'Rice Fields - Classic T-Shirt' })).toBeVisible()
    await expect(page.getByText('39,000').first()).toBeVisible()
    await expect(page.getByRole('button', { name: 'Black', exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Buy Now' })).toBeEnabled()
    await expect(page.getByText('This item has no purchasable option yet')).toHaveCount(0)
  })

  test('Buy Now creates a merch order and hands off to the shared payment hop', async ({ page }) => {
    await page.goto(`/en/store/products/${PRODUCT_ID}`)

    await page.getByPlaceholder('Enter your full name').fill('Test Buyer')
    await page.getByPlaceholder('e.g. 0912345678').fill('0912345678')
    await page.getByPlaceholder('House number, street name, ward').fill('27 Adair Avenue')

    await page.getByRole('combobox', { name: /City \/ Township/ }).click()
    await page.getByRole('option', { name: /Yangon/ }).click()

    await page.getByRole('button', { name: 'Buy Now' }).click()

    await expect(page).toHaveURL(new RegExp(`/en/orders/${MERCH_ORDER_ID}/payment`))
    expect(merchOrderPayload).toMatchObject({
      product_id: PRODUCT_ID,
      variant_id: VARIANT_ID,
      quantity: 1,
      city: 'Yangon',
    })
  })

  test('a merch order shows its item on the payment screen', async ({ page }) => {
    await page.goto(`/en/orders/${MERCH_ORDER_ID}/payment`)

    // Both summary rails ship in the DOM and only one is visible per breakpoint,
    // so the money lines are filtered down to what the buyer can actually see.
    // The regression: this screen used to derive everything from order.items[0].artwork,
    // which is empty for MERCH, so the buyer paid against a blank summary rail.
    await expect(page.getByText('Rice Fields - Classic T-Shirt').first()).toBeVisible()
    await expect(page.getByText('Black / L').first()).toBeVisible()
    await expect(page.getByText('42,000').locator('visible=true').first()).toBeVisible()
    await expect(page.getByText('Items Subtotal').locator('visible=true').first()).toBeVisible()
    await expect(page.getByText('Artwork information unavailable')).toHaveCount(0)
  })

  test('a merch order shows its item in order history and detail', async ({ page }) => {
    await page.route('**/api/v1/orders/**', (route) => {
      const path = new URL(route.request().url()).pathname
      if (path === '/api/v1/orders/orders/') {
        return json(route, { count: 1, results: [mockMerchOrder] })
      }
      if (path === `/api/v1/orders/orders/${MERCH_ORDER_ID}/`) return json(route, mockMerchOrder)
      return route.fallback()
    })

    await page.goto('/en/orders')
    await expect(page.getByText('Rice Fields - Classic T-Shirt').first()).toBeVisible()

    await page.goto(`/en/orders/${MERCH_ORDER_ID}`)
    await expect(page.getByText('Purchased Items').first()).toBeVisible()
    await expect(page.getByText('by Thura Lin').first()).toBeVisible()
  })

  test('artist detail exposes a Store tab listing that artist’s items', async ({ page }) => {
    await page.goto('/en/artists/5/store')

    await expect(page.getByRole('heading', { name: 'Rice Fields' }).first()).toBeVisible()
    await expect(page.getByText('Rice Fields - Classic T-Shirt').first()).toBeVisible()
  })
})
