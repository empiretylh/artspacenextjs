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
3. **Synchronization**: `useConversations` and `useMessages` maintain a real-time sync with Firestore. These hooks explicitly wait for the Firebase Authentication session (`auth.currentUser`) to be fully established.
4. **Pagination**: Messages are fetched in batches (default: 10) starting from the most recent. This is managed via `useMessages` by increasing the Firestore `limit()` on-demand.
5. **Infinite Scroll**: The `ChatMessages` component implements an automated pagination trigger using an `IntersectionObserver`.
6. **Data Synchronization**: 
    - **Mirroring**: User profiles are mirrored to a Firestore `/users` collection on every login and profile update.
    - **Retroactive Sync**: Updating a profile in Settings automatically triggers a batch update for the current user's entry in their top 50 most recent conversations.
    - **Self-Healing**: Every message sent refreshes the sender's metadata in the conversation to ensure long-term consistency.

## 🎨 UI & UX Patterns

- **Visual Anchoring**: The chat list uses `flex-col-reverse` to natively anchor the scroll to the bottom. This ensures that new messages appear at the bottom without requiring manual programmatic scrolling.
- **Message Bubbles**: Uses a modern rounded design (`rounded-2xl`) with directional "tails" (`rounded-tr-none` for sender, `rounded-tl-none` for receiver) to provide clear visual orientation.
- **Vertical Rhythm**: A `gap-y-3` is maintained between messages in the `ChatMessages` container to improve readability and prevent visual clutter.
- **Smart Loading**: During pagination, the chat list stays mounted. This prevents scroll position resets and ensures a flicker-free experience when loading older messages.
- **Auto-Correction**: If the initial load of 10 messages doesn't fill the entire viewport, the system detects the visible "load more" sentinel and immediately fetches additional batches until the screen is full.

## 🔐 Security & Operations

### [firestore.rules](file:///d:/data/learning/work/real-work/art-space-next/firebase/firestore.rules)
Production-grade security rules. 
- **Conversations**: Restricted to participants only.
- **Messages**: Restricted to conversation participants.
- **Users**: Owners can write to their own `/users/{uid}` document.
- **Validation**: Ensures only legitimate participants can be added.

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
