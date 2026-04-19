# Firebase Setup and Integration Guide

This document outlines the Firebase integration in the Myanmar Art Space project, including authentication synchronization, real-time chat features, and required environment variables.

## Overview

The project uses Firebase for real-time capabilities, specifically for the **Chat** feature. It integrates both the Client SDK (for frontend interactions) and the Admin SDK (intended for server-side verification or management).

### Key Features
- **Real-time Chat**: Built with Cloud Firestore, allowing users to send and receive messages instantly.
- **Auth Synchronization**: Automatically signs users into Firebase when they log in to the main application using a custom token provided by the backend.

---

## Configuration

The main configuration entry point is:
`src/features/service/firebase/firebase.ts`

This file initializes the Firebase app and exports the `auth` and `db` (Firestore) instances.

---

## Environment Variables

To enable Firebase features, you must configure the following variables in your `.env.local` file.

### Firebase Client (Public)
These are required for the frontend to connect to your Firebase project.

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_FIREBASE_ENABLE` | Set to `true` to enable Firebase services. |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Your Firebase project API Key. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Your Firebase project Auth Domain. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Your Firebase Project ID. |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Your Firebase Storage Bucket URL. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Your Messaging Sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Your Firebase App ID. |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Optional: Your Analytics Measurement ID. |

### Firebase Admin (Server-side)
Used for server-side operations (if any) and verified in `src/config/env.ts`.

| Variable | Description |
| --- | --- |
| `FIREBASE_CLIENT_EMAIL` | Service account client email. |
| `FIREBASE_PRIVATE_KEY` | Service account private key (ensure newlines are handled). |

---

## How it Works

### 1. Authentication Sync
When a user logs in, the project's main Auth system provides a `firebaseToken` (a Custom Token).
The `AuthInitializer` component (`src/features/auth/auth-initializer.tsx`) listens for this token and calls:
```typescript
await signInWithCustomToken(firebaseAuth, data.firebaseToken);
```
This ensures the user is authenticated in both the main app and Firebase, allowing them to access protected Firestore collections (like chats).

### 2. Chat Feature
The chat UI is located in `src/features/chat`. It uses Firestore to:
- Listen for real-time message updates.
- Send messages to specific conversation documents.
- Manage user conversation lists.

---

## Setup Instructions

1.  **Create a Firebase Project**: Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
2.  **Add a Web App**: Register a new web app in your project settings to get the Client configuration keys.
3.  **Enable Firestore**:
    *   Create a Firestore database.
    *   Set up security rules (e.g., allow authenticated users to read/write their own chats).
4.  **Enable Authentication**:
    *   No specific provider needs to be enabled in Firebase if you are only using Custom Tokens, but the service must be "enabled".
5.  **Service Account (Optional/Admin)**:
    *   Go to **Project Settings > Service Accounts**.
    *   Generate a new private key and copy the `client_email` and `private_key` to your environment variables.
