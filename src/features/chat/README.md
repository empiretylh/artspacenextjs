# Chat Feature Architecture

The Chat feature provides real-time messaging between Users (Artists, Galleries, and Collectors) using Firebase Firestore. It follows the vertical feature slice pattern located in `src/features/chat/`.

## 🏗️ Architecture

- **Pillar**: 2 (Feature Muscles)
- **Backend**: Firebase Firestore (NoSQL)
- **Real-time**: Handled via `onSnapshot` listeners in React hooks.
- **Identity**: Linked to the application's Firebase Authentication state.

### Directory Structure
- `components/`: UI components including the window, list, input, and messages.
- `hooks/`: Specialized listeners for conversations and messages.
- `pages/`: The top-level composition page.
- `types.ts`: Domain-specific types for messages and conversations.

## 🔃 Data Flow

1. **Initiation**: Chats can be initiated by navigating to `/chats?userId=[id]&userType=[type]`.
2. **Lazy Creation**: Conversations are only saved to Firestore when the first message is sent.
3. **Synchronization**: `useConversations` and `useMessages` maintain a real-time sync with Firestore.

## 🔐 Security & Operations

### Firestore Rules
Security is enforced by participant-based rules. Only users whose IDs are in the `participants` array can read or write to a conversation and its nested messages.
- Location: [firebase/firestore.rules](file:///d:/data/learning/work/real-work/art-space-next/firebase/firestore.rules)

### Deployment
Infrastructure changes (rules/indexes) must be synced using:
```bash
npm run deploy:firebase
```

## 🚩 Feature Flag
Controlled by `NEXT_PUBLIC_FEATURE_CHAT_ENABLE` in [src/config/env.ts](file:///d:/data/learning/work/real-work/art-space-next/src/config/env.ts).
- When `false`: Hides sidebar links, "Send Message" buttons, and protects the `/chats` route.

## 🗺️ Path Configuration
The Chat route is configured in `paths` as `paths.chats`.

---

> [!NOTE]
> When testing locally, ensure your `.env` has a valid Firebase configuration and the feature flag is enabled.
