# Services (Service): Global API Logic

> [!IMPORTANT]
> **AI MODELS**: This directory is the application's "Data Hub." It contains almost all logic for communicating with the Artspace backend. Standardizing lookups here prevents duplicating API logic within UI features.

## 🚀 Directory Structure
- **`artspace/`**: The primary implementation of the Artspace REST API.
- **`firebase/`**: (If present) Client-side Firebase initializers.

## 🏗️ Technical Pattern
Most files in `artspace/` follow a strict three-layer pattern to ensure consistency:

1.  **Direct API Call** (`get...` / `create...`):
    - Pure `async` functions using the global `api` client.
    - Handle parameter mapping (e.g., mapping `limit` to `page_size` for legacy backend compatibility).

2.  **Query Options Factory** (`get...QueryOptions`):
    - Returns an object compatible with TanStack Query.
    - Uses the global `queryKeys` factory to ensure cache stability.

3.  **Hooks** (`useGet...` / `useGet...Infinite`):
    - Standard hooks for UI components.
    - `Infinite` hooks handle `getNextPageParam` logic consistently across the app.

## 📂 Featured Service Hubs
- [get-artworks.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-artworks.tsx): The central service for all artwork discovery, filtering, and sorting.
- [get-users.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-users.tsx): A polymorphic service that handles "artists," "galleries," and "collectors" via a `userType` parameter.
- [get-blog-posts.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-blog-posts.ts): Central service for the public editorial magazine, articles, taxonomy filtering, and infinite feed.
- [get-blog-post.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-blog-post.ts): Single blog article reader lookup and prefetching.
- [get-blog-taxonomies.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/service/artspace/get-blog-taxonomies.ts): Public categories and tags lookups with active post counts.

## ⚠️ Known Gotchas for AI
- **Polymorphism**: Many entity types (Artists, Galleries) use the same `useGetUsers` hook with different `userType` parameters. Always look for existing generic services before creating new ones.
- **Param Normalization**: Services here use the `queryKeys` normalized params. To invalidate a cache, you MUST use the same `queryKeys` factory.
- **Infinite Queries**: Page size is often defaulted to `10`. Ensure UI components (like Intersection Observers) match this expectation.
