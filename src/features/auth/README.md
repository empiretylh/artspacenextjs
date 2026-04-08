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

## 🔑 Environment Variables
| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL for backend authentication endpoints. |
| `FIREBASE_ENABLE` | Toggle for Firebase synchronization. |

## ⚠️ Known Gotchas for AI
- **Firebase Re-sync**: Firebase sessions are synchronized *silently* during both manual login and automatic initialization. Do not implement separate Firebase login UI unless requested.
- **User Types**: The `user_type` (BUYER, ARTIST, COLLECTOR, GALLERY) drives a lot of UI logic. Always check the `isBuyer`, `isArtist`, etc. flags in the `useAuth` store.
- **Google Login**: The `loginWithGoogle` method in the store expects a token from the Google Auth flow and exchanges it directly with our backend, NOT directly with Firebase.
