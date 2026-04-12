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

### 2. Filtering & Discovery
- **Editorial Minimalist Aesthetic**: All gallery filters must follow the "High-Gravity Pill" standard:
    - **Inactive**: `bg-white`, `border-2 border-muted/70`, `shadow-sm`.
    - **Active**: `bg-primary`, `text-primary-foreground`.
- **Status Filter Logic**: The `status` filter (`AVAILABLE`, `SOLD`, etc.) is strictly **single-select**. Selecting a new status replaces the existing one in the URL state.
- **Quick Actions**: The "Available" pill acts as a high-visibility toggle for the `AVAILABLE` status.
- **Labels**: UI labels for status enums should use Title Case (e.g., "Available") rather than database ALL_CAPS.
- **Sidebar**: The [filter-sidebar.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/filter-sidebar.tsx) handles mutual exclusivity for status and performs advanced style/genre lookups.

## 📊 Model Enums
| Property | Valid Values |
| :--- | :--- |
| **Status** | `AVAILABLE`, `SOLD`, `NOT_FOR_SALE`, `SOLD_OUT` |
| **Visibility** | `PUBLIC`, `PRIVATE` |

## 📂 Key Files
- [artwork-create-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-create-form.tsx): The 300+ line form handling multi-step artwork entry.
- [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx): The primary UI card used in the masonry layout.
