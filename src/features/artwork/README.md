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
    - **Visibility**: Overlaid actions (like the heart button) use high-contrast backgrounds (`bg-white/90`) for legibility on any image.
- **High-Gravity Pills (Filters)**:
    - **Inactive**: `bg-white`, `border-2 border-muted/70`, `shadow-sm`.
    - **Active**: `bg-primary`, `text-primary-foreground`.
- **Labels**: UI labels for status enums should use Title Case (e.g., "Available") rather than database ALL_CAPS.
- **Sidebar**: The [filter-sidebar.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/filter-sidebar.tsx) handles responsive sheet layouts, mutual exclusivity for status, and dynamically fetches **Art Genres** and **Art Styles** to mirror the horizontal row.
- **Price Filter**: Handles user-friendly unchecking of selected preset ranges, dynamic state resetting, and launches in a default "Any Price" state ($0 - $10,000) to keep URLs clean until explicitly filtered.

### 2. Social Sharing & Dynamic Open Graph Cards
To guarantee premium presentation on platforms like Facebook, LinkedIn, Twitter/X, and Slack, the artwork detail routes use a dynamic Edge-rendered Open Graph generator:
- **Renderer**: Built using Next.js's native `ImageResponse` with Satori for server-rendered HTML/CSS as high-fidelity images.
- **Canvas Size**: Outputs exactly `1200x630` pixels (optimal 1.91:1 aspect ratio) for social sharing.
- **Aesthetic Layout**:
  - **Left Gallery Frame (55%)**: Centered frame featuring the artwork with `object-fit: contain` to preserve the source aspect ratio and prevent distortion or cropping.
  - **Right Info Placard (45%)**: Sleek typography containing the artwork title, artist name, medium, dimensions, year, and price (or status-specific indicators). Includes status indicator badges with distinct colors matching visual models.
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
- [artwork-create-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-create-form.tsx): The 300+ line form handling multi-step artwork entry.
- [artwork-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/components/app/artwork-card.tsx): The primary UI card used in the responsive grid layout.
- [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx): The detail view info card used on the artwork page.
- [route.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/app/api/og/route.tsx): Unified, dynamic, high-fidelity Open Graph image generator API.
