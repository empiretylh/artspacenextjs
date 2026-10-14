# Capacitor Mobile Notifications

This project now supports Android push notifications through Capacitor and Firebase Cloud Messaging (FCM). The existing backend sends FCM messages to device tokens registered at:

```text
POST /api/v1/orders/notification-devices/
```

## Setup

Install dependencies:

```bash
npm install
```

The Android project is located at:

```text
android/
```

Create a Firebase Android app using the Capacitor application ID:

```text
mm.illuminati.artspace
```

Download `google-services.json` from Firebase and place it at:

```text
android/app/google-services.json
```

Do not commit this file if the project policy treats Firebase configuration as private. Configure it through the deployment environment or secure project storage as appropriate.

## Build and run

The generated Android project currently requires Java 21. Android Studio's bundled JDK can be used on macOS:

```bash
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
java -version
```

The output should report Java 21 or newer. Java 17 causes `invalid source release: 21` during the Gradle build.

For this project, the production native shell loads the deployed Next.js website:

```env
CAPACITOR_SERVER_URL=https://myanmarartspace.net
```

The same URL is also the default in `capacitor.config.ts`, so production builds use it even when the environment variable is not explicitly provided. Set `CAPACITOR_SERVER_URL` only when targeting a staging or local server.

Then run:

```bash
npm run cap:sync
npm run cap:open:android
```

`CAPACITOR_SERVER_URL` is intentionally not a `NEXT_PUBLIC_` variable because it is read by the Capacitor build configuration, not by browser application code.

For local Android development, the native app can load a local development server by setting `CAPACITOR_SERVER_URL` to the machine address reachable from the emulator or device, for example `http://10.0.2.2:3000` for the Android emulator.

## Runtime flow

`NotificationListener` initializes `useNotificationDevice` after the user has authenticated. On a native Capacitor platform it:

1. Checks notification permission.
2. Requests permission when necessary.
3. Registers Capacitor push listeners.
4. Calls `PushNotifications.register()`.
5. Receives the FCM token from the `registration` event.
6. Registers the token with the Artspace backend.
7. Records `RECEIVED` and `OPENED` notification analytics events.
8. Navigates to the payload’s `web_route` after a notification tap.

The token request is made on login, app reload while authenticated, and whenever the notification listener is reinitialized. The backend deactivates the token when the user logs out.

## Firebase and backend requirements

The backend must have Firebase Admin service-account credentials configured through `FIREBASE_CREDENTIALS`. The Firebase project must match the Android Firebase project used by `google-services.json`.

The mobile app contains client-side Firebase configuration only. Never place the backend Firebase service-account private key in the Next.js app or Android project.

## Notification payload

The backend sends notification data similar to:

```json
{
  "notification_id": "123",
  "type": "NEW_BLOG_POST",
  "title": "New article",
  "message": "Read the latest story on Artspace.",
  "image_url": "https://cdn.example.com/blog/cover.webp",
  "web_route": "/blog/new-article",
  "deep_link": ""
}
```

The Capacitor click listener navigates to `web_route`. The notification remains persisted in the backend even if push delivery fails.

## Android release

Use Android Studio to configure the application icon, signing key, Firebase file, notification icon, and release build. Generate an APK for direct testing or an AAB for Google Play.

Capacitor itself adds no watermark. Google Play distribution requires a Play Console developer account; direct APK sharing does not require Play Console.
