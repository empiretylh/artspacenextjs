import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "mm.illuminati.artspace",
  appName: "Myanmar Art Space",
  webDir: "out",
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
