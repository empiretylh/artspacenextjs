# MAS Store (Store): Merch catalogue, preview & checkout

> [!IMPORTANT]
> **AI MODELS**: This directory sells physical goods printed with paintings that already live on the platform. It never sells the painting. The artwork itself is untouched by a merch order, and the license to print it belongs to the artist, not to MAS.

Phase 1 is manual by design: an admin creates an Item by matching **one artwork to one product type**, and the artist opts that artwork in from their own listing. There is no auto-matching and no 3D renderer.

## 🚀 Directory Structure
- **`api/`**:
  - [get-products.ts](./api/get-products.ts): `useGetProducts` / `useGetProduct` plus `getProductsQueryOptions(filters)`. Filters are exact-match only (`artwork`, `artist`, `product_type`, `is_published`, pagination). `getProductsQueryOptions` is the single source of the query key so the storefront, the Artist Detail tab and the admin table cannot drift onto different cache entries.
  - [get-product-types.ts](./api/get-product-types.ts): `useGetProductTypes()` with a 10-minute `staleTime`; the shape catalogue barely changes.
  - [create-merch-order.ts](./api/create-merch-order.ts): `POST /store/orders/` (Buy Now for one product + variant + quantity). Invalidates **both** `["user-orders"]` and `["orders"]` because merch and artwork orders share the same history screens.
  - [set-mas-store-eligibility.ts](./api/set-mas-store-eligibility.ts): `POST /artworks/artworks/{id}/mas-store-eligibility/`. This is the **only** way the flag changes; it is pinned read-only on the artwork serializer.
  - [admin-products.ts](./api/admin-products.ts) / [admin-product-types.ts](./api/admin-product-types.ts): staff create/update/delete. Both invalidate `queryKeys.store.all`.
- **`components/`**:
  - [product-preview.tsx](./components/product-preview.tsx): the layered 2D compositor (mockup → tint → art). See the contract below.
  - [product-card.tsx](./components/product-card.tsx), [colorway-selector.tsx](./components/colorway-selector.tsx), [store-order-form.tsx](./components/store-order-form.tsx).
  - `admin/product-dialog.tsx`, `admin/product-type-dialog.tsx`.
- **`pages/`**: `store-page.tsx` (browse, grouped by product type), `product-detail-page.tsx` (preview + colourway + size + Buy Now), `artist-store-page.tsx` (the Artist Detail "Store" tab, grouped by artwork), `store-admin-page.tsx` (staff catalogue).

Route compositors stay thin and live in `src/app/[locale]/(dashboard)`: public browse/detail under `(public)/store`, the artist tab under `(public)/[userType]/[id]/store`, the catalogue under `(protected)/store-admin`.

Entry points are the `masStore` nav item in `src/components/layout/nav-main.tsx` (desktop sidebar) and the 6th bottom tab in `src/components/layout/mobile-nav.tsx`; both read the label from `messages/en.json` / `messages/my.json`.

## 🏗️ Technical Logic

### 1. Two rules that hold the feature together
- **One Item = one artwork × one product type.** "Mug - Rice Fields" and "T-Shirt - Rice Fields" are two Product rows over one Artwork. Enforced server-side by a conditional unique constraint on published rows.
- **`order_type` is the discriminator.** A MERCH order leaves `Order.artwork` NULL and carries `store_lines`. Never branch on FK nullness; branch on `order.order_type === 'MERCH'`. See [orders/README.md](../orders/README.md).

### 2. Eligibility
`Artwork.mas_store_eligible` is set only by the artwork's `uploaded_by` (or staff). `IsOwnerOrAdmin` accepts `current_owner`, so a collector who bought the canvas must **not** be able to license the painting onto merchandise — `ArtworkViewSet.get_permissions()` has an explicit `mas_store_eligibility` branch for this, and it also defeats the class-level override swallowing the action's `permission_classes`. Revoking eligibility hides every product built on that artwork from the storefront without deleting the admin's work; a bookmarked checkout is still refused.

### 3. Preview contract
`ProductSerializer` returns `preview_config` **already merged** over the product type defaults (only `print_area` merges one level deeper). Render from the top-level object and duplicate no merge logic. `print_area` is `{x, y, w, h, rotation}` normalised to 0–1. The fallback frame in `product-preview.tsx` mirrors that default so an untuned product still previews where the art lands. `mask_asset` is a MediaAsset id, **not** a URL — it cannot be used as a CSS mask and is not rendered in phase 1.

### 4. Pricing, currency and royalty
A Product has no currency column; its **product type** owns the currency. `price` is the resolved selling price (`price_override` ?? type `base_price` + variant `price_modifier`), and `price_override` is exposed separately so the admin form can round-trip a blank back to "inherit". All options of one product must share a currency, so `create_merch_order` rejects a mixed-currency order rather than mis-settling it. `royalty_percent` / `royalty_amount` are frozen per line — tracked only, no payout automation in phase 1.

### 5. Purchase snapshots
`StoreOrderLine` copies title, product type name, colour, size, SKU, unit price, currency code, artwork id/title, artist name, thumbnail key, royalty percent and amount at purchase time. An admin editing a price or title later never rewrites an existing order, and the order screens render entirely from these snapshots with no product lookup.

### 6. Checkout
Buy Now posts `/store/orders/`, then hands off to the existing artwork payment hop `paths.order.payment.getHref(order.id)` (`/orders/{id}/payment`), which creates the MGPAY transaction. There is no separate merch cashier. A missing MAS seller account or an unknown delivery city fails as `503` / `400` **before** an order is created, so the app never produces an unpayable order.

### 7. Admin form details that are not obvious
- `slug` is never typed: both models derive it in `save()`, and it is read-only on the serializers.
- Variants are written **nested** on the product payload; matching is by id first, then colour+size, so an admin form can update or drop options in one call.
- Publishing a product whose artwork is not licensed is refused server-side; the dialog reads the artwork back and shows the licence state before saving.
- Authorisation is the server's job (`IsAdminUser` on every store write). The admin screen is the form, not the gate.

## 📈 Analytics
Merch reuses the ecommerce funnel in `src/lib/analytics.ts`. `add_payment_info` fires from the shared payment page; for a MERCH order the item list is built from `store_lines` (product title, `type · colour / size` as the category, unit price, quantity) instead of `itemFromArtwork`. No new event names.

## 🧪 Verification
- `e2e/store.spec.ts` runs the whole merch path against mocked APIs: browse grouped by type, product detail (preview + colourway + enabled Buy Now), Buy Now posting `/store/orders/` and landing on `/orders/{id}/payment`, a MERCH order rendering its line on the payment screen, the same line in order history and order detail, and the Artist Detail Store tab.
- The mocks match on **pathname**, not on a URL substring. `/store/products/` and `/store/products/<uuid>/` both contain `store/products/`, so a substring matcher hands the detail screen a list payload and the page silently renders an empty product priced at 0.
- Authenticated screens need the `artspace_auth_session` cookie plus the `artspace-auth` localStorage seed (same recipe as `e2e/customer-checkout-details.spec.ts`); without it `/orders/{id}/payment` redirects to sign-in.
- Both payment summary rails ship in the DOM and only one is visible per breakpoint, so money assertions use `.locator('visible=true')`.
- `npm run typecheck` is clean, and every file this feature touches is lint-clean. Repo-wide lint still reports ~29 pre-existing errors (e.g. the unused `Layers2Icon` in `nav-main.tsx`, `queryKeys` in `get-delivery-charges.ts`) that predate this feature.
- Verified on chromium. Firefox and Webkit binaries are not installed in this environment, so those two projects cannot run here.
- Backend coverage lives in `store/tests_*.py`.

## 🌄 Copy and localisation
The nav labels are translated (`masStore` in `messages/en.json` and `messages/my.json`), and the Burmese bottom tab renders. Page body copy is English-only, matching the orders feature it hands off to — do not translate one half of the checkout funnel and leave the other in English.

## ⚠️ Not built in phase 1
3D/GLTF rotation, print-on-demand provider APIs, royalty payouts, an admin media picker for mockups and heroes, and server-side cart. Multi-angle `preview_config.angles` is stored but not rendered.
