# Artworks (Artwork): The Core Asset Engine

> [!IMPORTANT]
> **AI MODELS**: Artworks are the lifeblood of this application. This directory manages the creation, updating, and cataloging of all art pieces. Note the complex payload transformations required for the backend.

## 🚀 Directory Structure
- **`api/`**: Mutation logic for creating and updating artworks.
- **`components/`**: Complex forms (Zod-driven) and the advanced filtering sidebar.
- **`pages/`**: Main catalog and detail views.

## 🏗️ Technical Logic: The Artwork Lifecycle

### 1. Creation & Updates
- **Validation**: Strict Zod schemas in `api/create-artwork.ts` and `api/update-artwork.ts`.
- **Payload Transformers**:
    - **Styles**: Backend requires a comma-separated string of IDs (`styles_artwork_ids`).
    - **Ownership**: Logic switches between `current_owner` (ID) and `current_owner_name` (string) based on the `are_u_owner` boolean.
    - **Owner Routing**: UI components use the `getUserRouteType` utility to dynamically route links to the correct owner profile (Artist, Gallery, or Collector) based on `current_owner_display.user_type`.
    - **Image**: Though the frontend handles arrays, the backend currently expects the first image as a single string.

## 🏗️ Technical Logic: Visual Standards

### 1. Card & Gallery Aesthetic
All artwork displays must follow the "Editorial Minimalist" standard:
- **Compact Card Standard**: 
    - **Ratios**: Default cards use a strictly 1:1 `aspect-square` for consistency.
    - **Corners**: Use `rounded-sm` for a sharp, premium feel.
    - **Density**: Minimal padding (`p-3`), no borders, and no shadows unless explicitly in "Masonry" mode.
    - **Visibility**: Overlaid actions (like the heart button) are styled for visibility (e.g., red color). On mobile, a top shadow overlay is used instead of a solid background button.
    - **Status**: Status badges (SOLD, NOT FOR SALE, etc.) are omitted from the card to maintain a clean, minimal aesthetic.
- **Filter Pills (Filters)**:
    - **Inactive**: `bg-background`, `border border-input`, `shadow-xs`.
    - **Active**: `bg-primary`, `text-primary-foreground`, `shadow-xs`.
- **Labels**: UI labels for status enums should use Title Case (e.g., "Available") rather than database ALL_CAPS.
- **Sidebar**: The [filter-sidebar.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/filter-sidebar.tsx) handles responsive layouts, currency selection (fetched via `useGetCurrencies`), and dynamic price ranges sync.
- **Price Filter**: Refactored to fetch dynamic quantile-based price levels and slider bounds from `/filter-options/` endpoint on the backend. Supports explicit currency toggling, automatic currency resetting on change, and multiple bracket checkboxes. Uses `price_min` and `price_max` URL params for custom sliders.

### 2. Social Sharing & Dynamic Open Graph Cards
To guarantee premium presentation on platforms like Telegram, Facebook, LinkedIn, Twitter/X, and WhatsApp, the artwork detail routes use a dynamic Sharp-powered Open Graph generator:
- **Renderer**: Built using `sharp` for high-performance server-side image processing, compositing, and letterboxing.
- **Canvas Size**: Outputs exactly `1200x630` pixels (optimal 1.91:1 aspect ratio) for social sharing.
- **Aesthetic Layout**:
  - The artwork is centered cleanly inside a studio gallery canvas (`#fcfbf9`) without cropping or distortion, preserving all original painting dimensions.
- **Performance & Native Typography**:
  - Ultra-fast server generation (~20–40ms) using `sharp` with WebP/JPEG/PNG decoding.
  - Native platform typography: Social platforms (Telegram, Facebook, WhatsApp) render the Burmese/Unicode artwork title and artist details using native OS text shaping engines, preventing broken ligatures or diacritic stacking bugs.
  - Edge caching headers (`Cache-Control: public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400`) for global CDN caching.
  - Dual metadata fallback with explicit `image/png` MIME types and direct artwork image fallbacks.
- **Unified API Route**: Located at [route.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/app/api/og/route.tsx) which is called with a dynamic artwork ID query parameter (e.g., `/api/og?id=[id]`) to inject crisp, high-fidelity sharing preview images into the page SEO metadata.

## 🧭 Discovery Feed (Recommended / Trending / Most Liked / Most Viewed)

The `/artworks` catalog opens as a ranked **Recommended** feed instead of newest-first. The URL stays the source of truth; ordering is driven entirely by the `ordering` query param.

- **Default (no `ordering`, no `search`)**: backend ranks by `trending_score`, with light personalization for signed-in users (followed artists, category/genre/style affinity from recent likes, saves and views). Already liked/saved artworks are demoted. Anonymous visitors get the global trending order.
- **Sort menu values** (see `artworks-page-view.tsx`):
  - `recommended` → clears `sort` so the request omits `ordering`
  - `trending_score-desc` → global trending
  - `like_count-desc` / `view_count-desc` → lifetime Most Liked / Most Viewed
  - `created_at-desc|asc`, `price-asc|desc` → existing behavior
- **Search precedence**: when `search` is present, relevance ordering wins and the ranked feed is not applied.
- **Homepage "Featured"** is pinned to `created_at desc` explicitly (`featured-artworks-section.tsx`) so it keeps its curated newest-first feel.

### Engagement counts
`Artwork` payloads now include `view_count`, `like_count` and `save_count` (all optional in the TS type for cached/older payloads):

- The detail page shows a compact formatted view count next to the title. Like counts are intentionally not displayed on catalog cards.

### View tracking
`src/features/service/artspace/track-artwork-view.ts` is a fire-and-forget tracker used by the detail page:

- `POST /artworks/artworks/:id/view/` with `{ visitor_id, source }`.
- `visitor_id` is a UUID persisted in `localStorage` (`mas_visitor_id`); signed-in requests are keyed by the JWT user server-side.
- The client guards with a module-level in-flight `Set` plus `sessionStorage["mas_viewed:<id>"]`, so a view is sent at most once per artwork per browser session. The backend additionally dedupes **one view per visitor per artwork per calendar day**, so repeat reloads never inflate the counter.
- Private artworks are not tracked (the request is a no-op / not recorded).

## 📊 Model Enums
| Property | Valid Values |
| :--- | :--- |
| **Status** | `AVAILABLE`, `SOLD`, `NOT_FOR_SALE`, `SOLD_OUT` |
| **Visibility** | `PUBLIC`, `PRIVATE` |

## 📈 Analytics Tracking
- **`begin_checkout`**: Triggered when a user clicks the "Collect Now" button on the [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx).
- **Source Context**: Auto-tagged as `artwork_detail` via the `useSource()` hook.

## ⚡ Performance & Navigation
- **Checkout Prefetching**: [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx) uses `@/i18n/routing` router prefetching on mount/available status to eliminate navigation latency when moving to `/artworks/:id/order`.
- **Immediate Transition**: Uses React `useTransition` to provide instant pending feedback and spinner states on the "Collect Now" button during navigation.
- **Auth-Aware Hydration & Private Artwork Guard**: `ArtworkDetailPage` and `useGetArtwork` reactively observe `auth.loading` so that direct URL navigation and page reloads for private artworks do not prematurely trigger 404 `notFound()` before user credentials/session finish initializing.
- **Resilient List Normalization**: Uses `normalizeListResponse` and `extractListItems` across `ArtworksPageView`, `RelatedArtworksListView`, and artwork queries to seamlessly handle both standard DRF paginated objects (`{ count, results: [] }`) and unpaginated arrays (`[]`) without runtime crashes.

## 🌐 Localization
- **Namespaces**:
  - `Artwork.catalog`: Translates catalog title, active filters bar, sorting dropdown options, empty state fallbacks, infinite scroll sentinels, and inquiry button.
  - `Artwork.filters`: Translates filter sheet drawer headers, section titles (Currency, Value Range, Availability, Art Forms, Art Genres, Art Styles), quick toggle row, and status enum labels.
  - `Artwork.detail`: Translates the full artwork detail view (specifications, buy box, artist info, authenticity certificate).
  - `Artwork.metadata`: Dynamic localized SEO titles and OpenGraph descriptions.
- **Burmese Typography & Diacritics Protection**:
  - `FilterRow` and `ArtworksPageView` dropdown triggers (`SelectTrigger`) use locale-scoped CSS rules (`html[lang="my"] [data-slot="select-value"]`) in `src/app/globals.css` with `overflow: visible !important` and `line-height: normal !important`. This prevents lower medials and subscripts (` ု`, ` ူ`, ` ျ`, ` ွ`, ` ္`) from being clipped by single-line clamp containers, while leaving English layout and vertical centering 100% unaffected.

## 🧪 Testing & E2E Coverage
The artwork creation, update, and deletion flows are covered by targeted Playwright end-to-end tests:
- [e2e/artwork-create-form.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/artwork-create-form.spec.ts): Comprehensive tests for new artwork creation.
- [e2e/artwork-update-form.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/artwork-update-form.spec.ts): Targeted tests for updating existing artworks.
- [e2e/artwork-delete.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/artwork-delete.spec.ts): Targeted tests for artwork deletion and cancellation flows.

### Key Creation Test Scenarios (`artwork-create-form.spec.ts`)
1. **Schema & Required Fields Validation**: Validates all required field constraints on empty submit (Image, Title, Category, Genre, Medium, Dimensions, Styles) and price lower-bound validation (`min(1)`).
2. **Complete Creation Submission**: Simulates an end-to-end creation flow including image upload mock via explicit `input[type="file"]`, category/genre selection, style tags with safe popover dismissal, visibility changes, price, description, search keywords, asserting both the dispatched POST payload and success toast notification.

### Key Update Test Scenarios (`artwork-update-form.spec.ts`)
1. **Pre-population, Field & Custody Modifications, and PATCH Submission**: Navigates to `/en/profile/artworks`, hovers over the target artwork card to reveal control actions, clicks the 3-dot trigger (`artwork-control-menu-trigger`) without `{ force: true }`, waits for "Edit" (`artwork-control-edit-button`) to be visible, and opens the update modal. Verifies initial pre-population of Title, Medium, Dimensions, Price, and Account Owner custody. Modifies Title, Price, Status to "Sold", unchecks account ownership to assign custody to custom holding gallery ('Yangon Heritage Gallery'), submits "Save Changes", and strictly asserts the captured `PATCH /artworks/artworks/:id/` payload, success toast notification, and dialog closure.

### Key Deletion Test Scenarios (`artwork-delete.spec.ts`)
1. **Confirmation Dialog & Cancellation**: Navigates to `/en/profile/artworks`, triggers card actions dropdown, clicks "Delete" (`artwork-control-delete-button`), and verifies the `DeleteConfirmDialog` opens with the artwork's title and description. Clicking "Cancel" closes the dialog and keeps the artwork intact on the page.
2. **Confirmed Deletion & Invalidation**: Confirms deletion from the dialog, asserts that `DELETE /artworks/artworks/:id/` is invoked, and confirms that the deleted artwork is removed from the list.

## 📂 Key Files
- [artwork.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/pages/artwork.tsx): Artwork detail page component featuring editorial header hierarchy (Artist Link + Title + Year), smart back navigation (`useSafeBack`), auth-synchronized loading gates, responsive mobile-first buy box placement, like toggle, and clickable tag filters.
- [artwork-image.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-image.tsx): Expanded gallery viewport with studio canvas framing, ViewerJS integration, and interactive "Click to expand & zoom" affordance pill.
- [artist-profile.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artist-profile.tsx): "About the Artist" section rendering artist info, dynamic artist summary badges (`artist_badges`), follow toggle, and direct messaging.
- [artwork-characteristics-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-characteristics-card.tsx): Structured artwork specification card with clickable artist profile links and category/style navigation.
- [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx): The detail view info card featuring instant checkout transition, active price inquiry and listed seller chat routing with pre-populated chat context (targeting `current_owner_display`), Save to Boards (`SaveToBoardDialog`), and authenticity reassurance.
- [related-artwork-list-container.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/related-artwork-list-container.tsx): Infinite-scrolling recommendation container with URL-isolated state management.
- [artwork-create-modal.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-create-modal.tsx): Modal wrapper rendering `ArtworkCreateForm`.
- [artwork-create-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-create-form.tsx): Section-based artwork creation form powered by generalized `FormDialog` and `FormSection` with external sticky footer, semi-bold typography, and boards-dialog visual standards.
- [artwork-update-modal.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-update-modal.tsx): Modal wrapper rendering `ArtworkUpdateForm`.
- [artwork-update-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-update-form.tsx): Section-based artwork update form powered by generalized `FormDialog` and `FormSection`.
- [delete-confirm-dialog.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/common/dialogs/delete-confirm-dialog.tsx): Framer-motion animated delete confirmation dialog.
- [artwork-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/app/artwork-card.tsx): The primary UI card used in the responsive grid layout.
- [route.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/app/api/og/route.tsx): Unified, dynamic, high-fidelity Open Graph image generator API.
- [artwork-create-form.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/artwork-create-form.spec.ts): Comprehensive Playwright E2E test suite for ArtworkCreateForm.
- [artwork-update-form.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/artwork-update-form.spec.ts): Targeted Playwright E2E test suite for ArtworkUpdateForm.
- [artwork-delete.spec.ts](file:///d:/data/learning/work/real-work/art-space-next/e2e/artwork-delete.spec.ts): Targeted Playwright E2E test suite for artwork deletion flow.

