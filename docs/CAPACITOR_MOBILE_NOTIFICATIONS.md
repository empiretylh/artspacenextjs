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
co.median.android.krrajyp
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

### Hardware back button

`MainActivity.registerBackHandler()` installs an `OnBackPressedCallback` that calls `WebView.goBack()` while history exists and otherwise hands the press back to the system, so back unwinds site navigation (routes and artwork filter changes push real history entries) instead of closing the app. This lives in native code on purpose: `@capacitor/app` is not a dependency, and the shell loads a remote site, so the behavior cannot regress when the web app is redeployed. Do not add a second JS `backButton` listener.

### Command-line Play build

The shell loads the live site (`server.url` in `capacitor.config.ts`), so `webDir` is only a fallback: keep `out/index.html` (a redirect stub) in place, otherwise `cap sync` fails with "web directory not found". Nothing from the site bundle is compiled into the AAB — a stale Play artifact is purely native, which is why a "plugin is not implemented on android" error means the uploaded build predates the plugin.

```bash
# 1. Register native plugins (must list @capgo/capacitor-social-login)
NODE_ENV=production npx cap sync android    # NODE_ENV=production keeps server.cleartext false

# 2. Bump android/app/build.gradle -> versionCode / versionName (Play rejects repeats)

# 3. Build with JDK 21 (Capacitor 7); Android Studio ships it
JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home" \
ANDROID_HOME="$HOME/Library/Android/sdk" \
  ./gradlew bundleRelease assembleRelease   # run from android/
```

`android/key.properties` points at `android/app/upload-key.jks`, so both artifacts are signed; without that file the release is unsigned.

Verify before uploading — a missing line below means the sync did not land in the artifact:

```bash
AAB=android/app/build/outputs/bundle/release/app-release.aab
unzip -p $AAB base/assets/capacitor.plugins.json | grep SocialLoginPlugin
for d in $(unzip -Z1 $AAB | grep "base/dex/classes.*dex"); do unzip -p $AAB $d | strings | grep -c SocialLoginPlugin; done
BT="$HOME/Library/Android/sdk/build-tools/36.1.0"
$BT/aapt dump badging android/app/build/outputs/apk/release/app-release.apk | grep ^package
$BT/apksigner verify --print-certs android/app/build/outputs/apk/release/app-release.apk
```

Google sign-in on Play installs also needs the **Play App Signing SHA-1** (Play Console > Release > Setup > App integrity) registered as an Android OAuth client for `co.median.android.krrajyp` in the same Google Cloud project as `NEXT_PUBLIC_GOOGLE_CLIENT_ID`; the upload-key SHA-1 only covers locally installed APKs. A mismatch shows up as `DEVELOPER_ERROR`, not "not implemented". Test APKs cannot be installed over a Play build because Play re-signs them.

## iOS App Store release

The two platforms keep different, permanent identifiers. `capacitor.config.ts` `appId` is the published Play `applicationId` (`co.median.android.krrajyp`) and cannot change; iOS ships `com.illuminati.artspace` in `ios/App/App.xcodeproj`, `GoogleService-Info.plist`, the Google Cloud iOS OAuth client and the App Store record. Capacitor has one `appId` for both platforms and `editProjectSettingsIOS()` copies it over `PRODUCT_BUNDLE_IDENTIFIER`, so never run `npx cap add ios` against the existing project (`cap sync ios` is safe — it does not touch the id). If the id is ever rewritten, restore it in both build configurations or push and Google sign-in break silently.

Archive from the command line with the **Release** configuration; the project file has no `DEVELOPMENT_TEAM`, so pass it or the build stops with *"Signing for 'App' requires a development team"*:

```bash
npm run cap:ios:pods   # repo root: patches the podspec, then pod install in ios/App
cd ios/App
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release \
  -destination 'generic/platform=iOS' -archivePath build/ArtSpace-v5.xcarchive \
  DEVELOPMENT_TEAM=87TTGHH95S -allowProvisioningUpdates archive
xcodebuild -exportArchive -archivePath build/ArtSpace-v5.xcarchive \
  -exportOptionsPlist build/ExportOptions.plist -exportPath build/export-v5 \
  -allowProvisioningUpdates DEVELOPMENT_TEAM=87TTGHH95S
cd ../..   # the verify and upload commands below run from the repo root
```

Xcode re-signs at export time: the checked-in `App.entitlements` value `aps-environment = development` becomes `production` and `get-task-allow` becomes `false`. The `.xcarchive` still shows the development identity and profile, so verify the exported IPA instead:

```bash
IPA=ios/App/build/export-v5/App.ipa
rm -rf /tmp/ipa && unzip -q "$IPA" -d /tmp/ipa
codesign -d --entitlements :- /tmp/ipa/Payload/App.app
security cms -D -i /tmp/ipa/Payload/App.app/embedded.mobileprovision | plutil -p - | grep -E 'Name|ProvisionedDevices'
```

Expect `aps-environment = production`, `get-task-allow = false`, profile name `iOS Team Store Provisioning Profile: com.illuminati.artspace`, and no `ProvisionedDevices` key. An IPA carrying a development profile uploads to TestFlight happily but delivers sandbox-only push.

Upload with the App Store Connect API key in `~/.appstoreconnect/private_keys` (key id `LDY5H66S43`, issuer `1db6ad78-c9b5-4c25-9433-48c891d76b92`):

```bash
xcrun altool --upload-app -t ios -f ios/App/build/export-v5/App.ipa \
  --apiKey LDY5H66S43 --apiIssuer 1db6ad78-c9b5-4c25-9433-48c891d76b92
```

or open the archive in Xcode -> Window -> Organizer -> Distribute App.

Bump `MARKETING_VERSION` and `CURRENT_PROJECT_VERSION` in both Debug and Release configurations before archiving: App Store Connect rejects a repeated build number, and the checked-in project drifts behind whatever was last archived in Xcode.

Sign in with Apple is implemented for the iOS shell (see the Apple Login gotcha in `src/features/auth/README.md`): the button, the native nonce flow, `/api/v1/users/auth/apple/` verification and the `com.apple.developer.applesignin` entitlement are in the repo. Portal state, checked on 2026-11-01: **Sign In with Apple is already enabled** on App ID `com.illuminati.artspace` — both cached profiles in `~/Library/Developer/Xcode/UserData/Provisioning Profiles` carry the entitlement, so the archive needs no portal step.

`ios/App/App/GoogleService-Info.plist` must be a member of the App target's **Copy Bundle Resources**, not just a file sitting in the folder. The file is tracked in git; the project reference was not, so every archive built from a clean checkout shipped without it and `FirebaseApp.configure()` logged *"could not find a valid GoogleService-Info.plist in your project"* — which kills FCM push and native Google sign-in, both of which read it. A build can pass archiving, upload, and still be broken this way, so check the bundle rather than the build log:

```bash
ls /tmp/ipa/Payload/App.app/GoogleService-Info.plist
```

If it is missing, re-add it with the `xcodeproj` gem (CocoaPods already pulls it in) instead of hand-editing the project file:

```bash
~/.rbenv/versions/3.2.2/bin/ruby -e '
require "xcodeproj"
p = Xcodeproj::Project.open("ios/App/App.xcodeproj")
t = p.targets.find { |x| x.name == "App" }
g = p.main_group["App"]
n = "GoogleService-Info.plist"
r = g.files.find { |f| f.path.to_s.end_with?(n) } || g.new_reference(n)
t.resources_build_phase.add_file_reference(r) unless t.resources_build_phase.files_references.include?(r)
p.save'
```

Deployment target is iOS 15.0 in `Podfile` and in all four `IPHONEOS_DEPLOYMENT_TARGET` settings (project and target, Debug and Release). App Store Connect warns on any build targeting below 15.0 from April 2027, and the value is read from the binary's `minos`, so bump both places and re-run `npm run cap:ios:pods` — the Pods project regenerates from the `platform` line.

`npm run cap:ios:pods` is what makes the plugin build the Apple provider at all: it patches `@capgo/capacitor-social-login`'s podspec to add Alamofire, then runs `pod install`. Without Alamofire the plugin's `#if canImport(Alamofire)` guard compiles the whole Apple provider out and login rejects with "Apple Sign-In provider is disabled. Dependencies are not available".

The patch is deliberately an explicit script and not a `postinstall` hook. The `deps` stage of `Dockerfile` copies only `package.json` and `package-lock.json` before `npm ci`, so a `postinstall` that reads `scripts/patch-social-login-podspec.mjs` fails every web build with `MODULE_NOT_FOUND` long before the iOS toolchain is involved.

CocoaPods is installed (`~/.rbenv/shims/pod`, 1.16.2) even though `npx cap doctor` reports it missing, and `pod` aborts with `Unicode Normalization not appropriate for ASCII-8BIT` unless the locale is UTF-8 — the script sets `LANG`/`LC_ALL` for that reason.

The shell loads `https://myanmarartspace.net`, so the Apple button only appears for testers once the Next.js site and the Django `/api/v1/users/auth/apple/` endpoint are deployed — a TestFlight build on its own ships the native plumbing, not the UI. Deploy the API first or the route 500s.
