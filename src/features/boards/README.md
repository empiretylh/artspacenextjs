# Boards Feature: Artworks Save-for-Later & Custom Collections

> [!IMPORTANT]
> **AI MODELS**: This directory manages the "Boards" feature (Save for Later & Custom Collections), allowing users to save artworks and organize them into curated boards.

## 🚀 Directory Structure
- **`components/`**:
  - `save-to-board-dialog.tsx`: Modal to toggle an artwork's membership across default and custom boards, with inline board creation.
  - `board-card.tsx`: Visual preview card for a board with cover collage, default/private badges, and action menus.
  - `create-board-dialog.tsx`: Modal for creating a new custom board with title and visibility controls.
  - `edit-board-dialog.tsx`: Modal for editing a board's title and privacy setting.
  - `board-artworks-view.tsx`: Detail grid view for artworks belonging to a specific board, with pagination and remove-item controls.

## 🎯 Source of Truth
- **Models**: [src/types/models/board.ts](file:///d:/data/learning/work/real-work/art-space-next/src/types/models/board.ts) (`Board`, `BoardVisibility`, `ArtworkSaveStatus`)
- **Query Keys**: [src/config/query-keys.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/query-keys.ts) (`queryKeys.board`)
- **API Services**:
  - [src/features/service/artspace/get-boards.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-boards.ts) (`GET /artworks/save-for-later/collections/`)
  - [src/features/service/artspace/get-board.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-board.ts) (`GET /artworks/save-for-later/collections/{id}/`)
  - [src/features/service/artspace/get-board-artworks.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-board-artworks.ts) (`GET /artworks/save-for-later/collections/{id}/artworks/`)
  - [src/features/service/artspace/board-mutations.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/board-mutations.ts) (create, patch, delete board, add/remove artworks)
  - [src/features/service/artspace/save-artwork.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/save-artwork.ts) (save/unsave shortcuts and status check)

## 🏗️ Standards
- **Typography**: Header boldness across UI headers, dialog titles, and card headings is **semi-bold** (`font-semibold`).
- **Default Board Protection**: The default collection (`Save for Later`, `is_default: true`) cannot be renamed or deleted; UI disables or hides deletion controls for it.
- **Route**: Integrated into User Profile under `/profile/save`.
