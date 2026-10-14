import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
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
