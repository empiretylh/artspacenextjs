import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  // Capacitor has a single appId for both platforms, and `cap add ios` copies it
  // over PRODUCT_BUNDLE_IDENTIFIER in the Xcode project. This value is the
  // published Play Store applicationId and cannot change, so iOS intentionally
  // diverges: its bundle id is com.illuminati.artspace (GoogleService-Info.plist,
  // Google Cloud iOS OAuth client, the uploaded App Store builds). Never re-add
  // the ios platform, or push and Google sign-in break silently.
  appId: "co.median.android.krrajyp",
  appName: "Myanmar Art Space",
  webDir: "out",
  plugins: {
    SocialLogin: {
      providers: {
        google: true,
        facebook: false,
        apple: true,
        twitter: false,
      },
    },
    FirebaseMessaging: {
      presentationOptions: ["alert", "badge", "sound"],
    },
  },
  android: {
    adjustMarginsForEdgeToEdge: "force",
  },
  ...(process.env.CAPACITOR_SERVER_URL || "https://myanmarartspace.net"
    ? {
        server: {
          url: process.env.CAPACITOR_SERVER_URL || "https://myanmarartspace.net",
          cleartext: process.env.NODE_ENV !== "production",
        },
      }
    : {}),
};

export default config;
