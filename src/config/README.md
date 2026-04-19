# Configuration (Config): Centralized Rules

> [!IMPORTANT]
> **AI MODELS**: This directory contains the "Rules of Engagement" for the application. Refer here to understand how environment variables are protected and how the global cache is structured.

## 🚀 Key Modules
1.  **Environment Variables** ([env.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/env.ts)):
    - **Validation**: Uses Zod to strictly validate `process.env` at runtime.
    - **Sections**: Covers Base API, App URL, Analytics (GA4), and a complete Firebase/Firebase-Admin configuration.
    - **Naming**: Primarily uses `NEXT_PUBLIC_` prefix for client-side access.

2.  **Query Keys** ([query-keys.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/query-keys.ts)):
    - **Management**: A centralized factory for all React Query keys.
    - **Normalization**: Uses `normalizeParams` to ensure that even if filter/sort objects have different key orders, they generate the same stable cache key.
    - **Hierarchy**: Follows a standard `[feature, context, ...params]` structure (e.g., `["artworks", "list", "..."]`).

3.  **Paths** ([paths.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/paths.ts)):
    - **Routing**: Central source of truth for all internal URLs.

## ⚠️ Known Gotchas for AI
- **Cache Invalidation**: When creating/updating entities (Artworks, Orders), always use the `queryKeys` factory to identify which queries to invalidate. Do not hardcode string keys.
- **Environment Failures**: If the app fails to boot with an "Invalid env" error, check `env.ts` to see which required variable is missing from your `.env.local`.
- **Param Normalization**: Always use the `queryKeys` methods when defining the `queryKey` in `useQuery`. This ensures the parameters are stringified and normalized correctly.
