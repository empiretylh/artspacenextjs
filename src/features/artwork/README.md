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
    - **Image**: Though the frontend handles arrays, the backend currently expects the first image as a single string.

### 2. Filtering & Discovery
- The [filter-sidebar.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/filter-sidebar.tsx) is the most complex component. It synchronizes URL params with the global [queryKeys.artwork](file:///d:/data/learning/work/real-work/art-space-next/src/config/query-keys.ts).

## 📊 Model Enums
| Property | Valid Values |
| :--- | :--- |
| **Status** | `AVAILABLE`, `SOLD`, `NOT_FOR_SALE`, `SOLD_OUT` |
| **Visibility** | `PUBLIC`, `PRIVATE` |

## 📂 Key Files
- [artwork-create-form.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/artwork-create-form.tsx): The 300+ line form handling multi-step artwork entry.
- [product-info-card.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artwork/components/product-info-card.tsx): The primary UI card used in the masonry layout.
