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
- **High-Gravity Pills (Filters)**:
    - **Inactive**: `bg-white`, `border-2 border-muted/70`, `shadow-sm`.
    - **Active**: `bg-primary`, `text-primary-foreground`.
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

## 📊 Model Enums
| Property | Valid Values |
| :--- | :--- |
| **Status** | `AVAILABLE`, `SOLD`, `NOT_FOR_SALE`, `SOLD_OUT` |
| **Visibility** | `PUBLIC`, `PRIVATE` |

## 📈 Analytics Tracking
- **`begin_checkout`**: Triggered when a user clicks the "Order Now" button on the [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx).
- **Source Context**: Auto-tagged as `artwork_detail` via the `useSource()` hook.

## 📂 Key Files
- [artwork.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/pages/artwork.tsx): Artwork detail page component featuring smart back navigation (`useSafeBack`).
- [artwork-create-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-create-form.tsx): The 300+ line form handling multi-step artwork entry.
- [artwork-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/app/artwork-card.tsx): The primary UI card used in the responsive grid layout.
- [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx): The detail view info card used on the artwork page.
- [route.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/app/api/og/route.tsx): Unified, dynamic, high-fidelity Open Graph image generator API.

