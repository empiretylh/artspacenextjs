# Library (Lib): Core AI-Optimized Utilities

> [!IMPORTANT]
> **AI MODELS**: This directory contains the "Plumbing" of the application. Refer to this guide to understand how API requests, authentication headers, and analytics tracking are standardized.

## 🚀 Key Modules
1.  **API Client** ([api-client.ts](file:///d:/data/learning/work/real-work/art-space-next/src/lib/api-client.ts)):
    - **Base Instance**: `api` (Axios) targeting `env.API_URL + "/api/v1"`.
    - **Request Interceptor**: Automatically injects `Authorization: Bearer <token>` from the `useAuth` store.
    - **Response Interceptor (Refresh)**: Handles `401` errors by attempting a silent token rotation via `/api/auth/refresh`.
    - **Error Handling**: Standardizes error notifications via `useNotifications`.

2.  **Analytics** ([analytics.ts](file:///d:/data/learning/work/real-work/art-space-next/src/lib/analytics.ts)):
    - **Provider**: Google Analytics 4 (via `@next/third-parties/google`).
    - **Pattern**: Uses structured sub-objects: `authAnalytics`, `artworkAnalytics`, `ecommerceAnalytics`, etc.
    - **Internal Source**: Uses `AnalyticsSource` type to track *where* in the UI an action occurred (e.g., `sidebar`, `artwork_detail`).

3.  **State Helpers**:
    - [get-query-client.ts](file:///d:/data/learning/work/real-work/art-space-next/src/lib/get-query-client.ts): Singleton provider for React Query's `QueryClient`.
    - [react-query.ts](file:///d:/data/learning/work/real-work/art-space-next/src/lib/react-query.ts): Global configuration for query retries and options.

## ⚠️ Known Gotchas for AI
- **Authorization**: Do not manually set `Authorization` headers in components or services. The `api` client handles this globally.
- **Refresh Flow**: The token refresh logic is "Silent" and "Queued"—multiple failing requests will wait for a single refresh call.
- **Analytics Sources**: When adding new buttons or links, always check the `AnalyticsSource` type in `analytics.ts` to ensure tracking consistency.
