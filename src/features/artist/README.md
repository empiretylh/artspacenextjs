# Artist Feature: AI & Developer Guidance

> [!IMPORTANT]
> **AI MODELS**: Artists in this project are a specialized sub-type of the `User` model. Most data-fetching logic for artists is located in the global `service/artspace` directory rather than within this folder.

## 🚀 Lookup Order (How to read this feature)
1.  **Model Discovery**: Check `src/types/models/index.ts` for the `Artist` and `User` interfaces.
2.  **Data Sourcing**: Look at `src/features/service/artspace/get-artists.tsx` and `get-users.tsx` for fetching logic.
3.  **UI Implementation**: This directory (`src/features/artist`) contains UI-specific components like featured listings.

## 🏗️ Architecture Overview
The "Artist" entity is defined by `user_type: "ARTIST"` in the backend. 
- **Profiles**: Artists share the standard `Profile` model but usually have populated `bio`, `about`, and `num_artworks` fields.
- **Relationships**: Artists are the owners of `Artwork` entities and can be participants in `Event` entities.

## 📂 Key Files
- [components/featured-artists.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/artist/components/featured-artists.tsx): Main entry point for displaying artist discovery lists in sidebars or landing pages.
- [service/artspace/get-artists.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-artists.tsx): The React Query hook used to fetch artist listings with filters (limit, userType).

## ⚠️ Known Gotchas for AI
- **Sparse Directory**: Do not be alarmed that this directory only contains `components`. The heavy lifting (API, Types) is centralized in `src/features/service` and `src/types` to allow for code reuse across Buyer/Collector profiles.
- **UserType Mapping**: When fetching "Artists," ensure you pass the string `"artists"` (lowercase, plural) to the `userType` parameter in hooks if they consume the generic `get-users` service.
