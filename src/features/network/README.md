# Network Feature Architecture

The Network feature surfaces connectivity state and renders a full-screen offline experience when the device has no internet connection.

## 🏗️ Architecture

- **Pillar**: 3 (Shared Skin / Global Enhancement)
- **Platforms**: Native (Android/iOS) for connectivity detection via `@capacitor/network`; falls back to `navigator.onLine` on the web.
- **Native shell split**:
  - **Cold start / load failure**: handled natively in `android/app/src/main/java/co/median/android/krrajyp/MainActivity.java` using `ConnectivityManager` monitoring plus a native `offline_view.xml` layout. It is shown when the site content has not loaded (`pageLoaded == false`).
  - **Mid-session disconnect**: handled by the in-app `OfflineOverlay` React component inside the WebView. The native view intentionally steps aside once the page has loaded.

## 📦 Directory Structure

- `hooks/`:
  - `use-network-status.ts`: Returns `{ isOnline, isNative, check }`. Subscribes to `@capacitor/network` `networkStatusChange` on native and the browser `online`/`offline` events on web.
- `components/`:
  - `offline-overlay.tsx`: Full-screen, minimal offline state (logo, `WifiOff` icon, message, "Try Again"). Renders only on the native platform while offline.

## 🔃 Data Flow

1. `OfflineOverlay` is mounted globally by `components/providers/global-provider.tsx`.
2. On native, `useNetworkStatus` reads `Network.getStatus()` and listens for `networkStatusChange`; on web it listens to `online`/`offline`.
3. When offline on a native platform the overlay covers the app. "Try Again" re-checks the status and reloads the WebView if connectivity is restored; the overlay also auto-dismisses on reconnect.

## 🎨 Design

- Colors live in `android/app/src/main/res/values/colors.xml` and `values-night/colors.xml` (light/dark).
- The web overlay mirrors the native layout and uses the shared theme tokens (`bg-background`, `text-muted-foreground`, `bg-muted`, `bg-primary`).
