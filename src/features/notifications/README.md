# Notifications Feature Architecture

The Notifications feature provides persisted in-app notifications, realtime updates through Server-Sent Events (SSE), device push token registration (Web FCM & Median bridge), and product analytics tracking.

## 🏗️ Architecture

- **Pillar**: 2 (Feature Muscles)
- **Base Endpoint**: `/api/v1/orders/notifications/` and `/api/v1/orders/notification-devices/`
- **Realtime Stream**: Foreground Server-Sent Events (SSE) via `fetch` streaming with exponential backoff and offline recovery.
- **Push Layer**: Web FCM + Median.co JavaScript Bridge (`median.firebaseMessaging`) for native iOS/Android shells.
- **Analytics Funnel**: Records `RECEIVED`, `OPENED`, `DISMISSED`, `DEEPLINK_OPENED`, and `SSE_RECEIVED` events via `/orders/notifications/{id}/events/`.

## 📦 Directory Structure

- `api/`: API services using Axios client:
  - `get-notifications.ts`: Lists current user notifications.
  - `get-notification.ts`: Retrieves a single notification.
  - `mark-notification-read.ts`: Marks a notification as read.
  - `mark-all-notifications-read.ts`: Marks all notifications as read.
  - `register-device.ts`: Registers push token (`ANDROID`, `IOS`, or `WEB`).
  - `deactivate-device.ts`: Deactivates push token on logout.
  - `record-notification-event.ts`: Logs client analytics events.
- `hooks/`:
  - `use-notifications.ts`: React Query integration with optimistic UI updates for marking read.
  - `use-notification-stream.ts`: Resilient SSE reader connecting to `/api/v1/orders/notifications/stream/` with automatic cache updates and toasts.
  - `use-notification-device.ts`: Automatically handles FCM and Median push token lifecycle.
- `components/`:
  - `notification-dropdown.tsx`: Interactive Popover on Bell click with unread badge, tabs (All / Unread), and quick actions (preserves open state on new-tab interactions).
  - `notification-item.tsx`: Notification card rendering semantic `<Link>` or `<a>` when `web_route` is present, supporting browser link preview on hover, native new-tab middle clicks, and contextual icons.
  - `notification-list.tsx`: Reusable list with empty and loading states.
  - `notification-listener.tsx`: Headless component mounted globally in root layout to manage SSE and device tokens.
- `pages/`:
  - `notifications-page.tsx`: Dedicated full page for notifications (`/notifications`).
- `store/`:
  - `notification-store.ts`: Zustand store for notification UI states.

## 🔃 Data Flow

1. **Initialization**: When an authenticated session exists, `<NotificationListener />` initializes the device token and opens the SSE stream.
2. **Foreground Realtime**: New notifications received via SSE:
   - Invalidate or prepend to React Query cache (`queryKeys.notification.list()`).
   - Fire a `Sonner` toast with a direct action link to `web_route`.
   - Send `SSE_RECEIVED` analytics event.
3. **User Interaction**:
   - Items render as semantic localized `<Link href={web_route}>` (or external `<a>`), showing browser URL preview on hover.
   - Clicking (or middle-clicking) triggers `markAsRead({ id })` with optimistic UI update and logs an `OPENED` analytics event.
   - Left-clicks close the dropdown and navigate; middle-click / new-tab clicks keep the dropdown open.
4. **Offline Recovery**: If the SSE stream disconnects, it reconnects using exponential backoff (1s up to 30s) and automatically re-fetches the notification list to recover any missed events.

## 🔔 Push Notifications & Service Worker

Background push notifications are processed by `src/app/firebase-messaging-sw.js/route.ts`:
- Reads `data.web_route` and directs user to the correct page upon clicking.
- Keeps badge in sync using `navigator.setAppBadge`.
