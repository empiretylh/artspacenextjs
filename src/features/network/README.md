# Network Feature Architecture

The Network feature surfaces connectivity state and renders a full-screen offline experience when the device has no internet connection.

## 🏗️ Architecture

- **Pillar**: 3 (Shared Skin / Global Enhancement)
- **Platforms**: Native (Android/iOS) for connectivity detection via `@capacitor/network`; falls back to `navigator.onLine` on the web.
- **Native shell split**:
  - **Cold start / load failure**: handled natively in `android/app/src/main/java/co/median/android/krrajyp/MainActivity.java` using `ConnectivityManager` monitoring plus a native `offline_view.xml` layout. It is shown when the site content has not loaded (`pageLoaded == false`).
  - **Mid-session disconnect**: handled by the in-app `OfflineOverlay` React component inside the WebView. The native view intentionally steps aside once the page has loaded.

## 💾 Offline data cache

Connectivity alone cannot render the app: the native shell loads the live site through `server.url`, so a cold start without network has no HTML to show (native offline view). To keep already-loaded screens usable while disconnected, the app persists React Query's cache:

- [src/lib/query-persistence.ts](file:///d:/data/learning/work/real-work/art-space-next/src/lib/query-persistence.ts) builds a `localStorage` persister (`ARTSPACE_QUERY_CACHE`, 24h max age, 1s throttle, `QUERY_CACHE_BUSTER` for invalidating stale shapes).
- [src/app/[locale]/providers.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/app/[locale]/providers.tsx) wraps the app in `PersistQueryClientProvider`, which restores the cache before queries subscribe. During SSR a no-op persister is used.
- `getQueryClient` sets `gcTime` to 24h so restored queries are not garbage collected.
- `clearPersistedQueryCache` is called on logout (`features/auth/store.ts`) and on session expiry (`lib/api-client.ts`) so private data never leaks into the next session.
- Images are **not** persisted; offline screens show whatever the WebView HTTP cache retained.

> [!NOTE]
> This is level 1 of offline support. Cold-start offline UI (rendering a cached app shell after the app is killed) requires a service worker or bundling the UI locally, which the current `server.url` setup does not provide.

## 📦 Directory Structure

- `hooks/`:
  - `use-network-status.ts`: Returns `{ isOnline, isNative, check }`. Subscribes to `@capacitor/network` `networkStatusChange` on native and the browser `online`/`offline` events on web.
- `components/`:
  - `offline-overlay.tsx`: Native-only offline UI. Renders a slim "showing saved content" banner when the query cache has data, and the full-screen blocker (logo, `WifiOff` icon, message, "Try Again") when there is nothing cached.

## 🔃 Data Flow

1. `OfflineOverlay` is mounted globally by `components/providers/global-provider.tsx`.
2. On native, `useNetworkStatus` reads `Network.getStatus()` and listens for `networkStatusChange`; on web it listens to `online`/`offline`.
3. When offline on a native platform the overlay either shows a non-blocking banner (cached data available) or covers the app (no cache). "Try Again" re-checks the status and reloads the WebView if connectivity is restored; both states auto-dismiss on reconnect.

## 🎨 Design

- Colors live in `android/app/src/main/res/values/colors.xml` and `values-night/colors.xml` (light/dark).
- The web overlay mirrors the native layout and uses the shared theme tokens (`bg-background`, `text-muted-foreground`, `bg-muted`, `bg-primary`).
