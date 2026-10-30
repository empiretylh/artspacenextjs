# Auth Feature: AI & Developer Guidance

> [!IMPORTANT]
> **AI MODELS**: Read this file first before modifying any authentication or user-session logic. It defines the architectural "Lookup Order" and Platform synchronization rules.

## 🚀 Lookup Order (How to read this feature)
When exploring or debugging, follow this order to understand the truth of the system:

1.  **Platform Discovery**: Check `env.ts` and `.env.local` for `FIREBASE_ENABLE` and backend API endpoints.
2.  **Model Discovery**: Check `src/types/models/index.ts` for the `User` entity and `src/features/auth/store.ts` for the `State` type.
3.  **State Logic**: `src/features/auth/store.ts` is the central source of truth for the session.
4.  **Sync Mechanism**: `src/features/auth/auth-initializer.tsx` handles the initial handshake between the backend session and the frontend stores (Zustand + Firebase).

## 🏗️ Architecture Overview
This project uses a **Dual-Token Handshake** system:
1.  **Primary Auth**: Handled by a custom backend API. Successful login returns an `accessToken` (JWT) and a `firebaseToken` (Custom Token).
2.  **Secondary Auth (Firebase)**: If `FIREBASE_ENABLE` is true, the frontend uses the `firebaseToken` to perform a `signInWithCustomToken` call. This enables real-time features (like Chat or Notifications) while keeping the primary auth source-of-truth on the backend.

## 📂 Key Files
- [store.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/auth/store.ts): Zustand state management. Handles API calls for login/register and manages the `user` object.
- [auth-initializer.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/auth/auth-initializer.tsx): A client-side "bootstrapper" component that fetches the current session and populates the store on app load.
- [hooks/use-login-form.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/auth/hooks/use-login-form.ts): React-hook handling form validation and submission.
- [components/google-auth-button.tsx](file:///d:/data/learning/work/real-work/art-space-next/src/features/auth/components/google-auth-button.tsx): Cross-platform Google sign-in control (GIS on web, native plugin in the app).
- [lib/native-google-auth.ts](file:///d:/data/learning/work/real-work/art-space-next/src/features/auth/lib/native-google-auth.ts): Native Google Sign-In wrapper returning an `idToken`.

## 🔑 Environment Variables
| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for backend authentication endpoints. |
| `FIREBASE_ENABLE` | Toggle for Firebase synchronization. |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Web OAuth client ID; also used as `webClientId`/`iOSServerClientId` on native. |
| `NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID` | iOS OAuth client ID required by the native Google Sign-In SDK. |

## ⚠️ Known Gotchas for AI
- **Firebase Re-sync & `isFirebaseReady`**: Firebase sessions are synchronized *silently* during both manual login and automatic initialization. A reactive `isFirebaseReady` boolean in `useAuth` tracks when the client-side Firebase token handshake is fully authenticated (verified via `onAuthStateChanged`). Real-time features (Chat, Presence, FCM) MUST gate their Firestore listeners on `isFirebaseReady` to prevent permission-denied errors and race conditions on page refresh.
- **User Types**: The `user_type` (BUYER, ARTIST, COLLECTOR, GALLERY) drives a lot of UI logic. Always check the `isBuyer`, `isArtist`, etc. flags in the `useAuth` store.
- **Privacy Settings**: The `User` model's `Profile` object now includes privacy preferences (e.g., `show_email`, `hide_collector_name`). These are managed in `src/features/settings` but impact components across the app. Always respect these flags when displaying user data.
- **Google Login**: The `loginWithGoogle` method in the store expects a Google `idToken` and exchanges it directly with our backend, NOT directly with Firebase. The token is produced by `GoogleAuthButton` (`components/google-auth-button.tsx`): on the **web** it renders the Google Identity Services button (`@react-oauth/google`, `credential`); on **native (Capacitor)** it uses `@capgo/capacitor-social-login` via `lib/native-google-auth.ts` (`SocialLogin.login({ provider: "google" })`). The native flow is required because GIS renders a popup that Capacitor opens in the system browser and never returns. Native requires the platform client IDs (Android package + SHA-1, iOS bundle + reversed client ID) configured in Google Cloud, and the native init/config in `capacitor.config.ts` (`plugins.SocialLogin.providers`), `MainActivity.java` (Android) and `AppDelegate.swift` (iOS).
- **Google Login env vars are build-time**: `NEXT_PUBLIC_*` values are inlined into the client bundle during `next build`. The native app loads the deployed site (`server.url` in `capacitor.config.ts`), so a missing `NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID` in the deployment's `.env.production` makes iOS sign-in fail with "No provider was initialized" while Android keeps working. Verify a build with `grep -l '<ios-client-id>'` over the deployed `_next/static/chunks/*.js`.
- **Session Cookie Size Limit**: Chrome strictly enforces a 4KB cookie size limit. To prevent Chrome from dropping the `artspace_auth_session` cookie, we store a minimized user object using `getMinimalUser()` (defined in `src/lib/auth.ts`), which clears out potentially large fields like `bio` and `about` by setting them to empty strings, and removes `website` and `features_photos` entirely. The full user profile is still returned in the JSON response of authentication APIs to fully populate the client Zustand store, and the client queries the profile dynamically from the backend for layouts or editing.
