import { ScrollToTop } from "@/components/common/scroll-to-top";
import { AuthInitializer } from "@/features/auth/auth-initializer";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppProvider from "./providers";
import { env } from "@/config/env";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "Myanmar Art Space",
    template: "%s | Myanmar Art Space",
  },
  description: "Social Media and E-commerce Platform.",
};

import { FcmManager } from "@/features/chat/components/fcm-manager";
import NextTopLoader from "nextjs-toploader";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfitSans.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <NextTopLoader
          color="var(--primary)"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={false}
          easing="ease"
          speed={200}
          shadow="0 0 10px var(--primary),0 0 5px var(--primary)"
        />
        {/* <GoogleTagManager gtmId={env.GTM_ID as string} /> */}
        <GoogleAnalytics debugMode={env.NODE_ENV === "development"} gaId={env.GA_ID as string} />
        <AppProvider>
          <AuthInitializer />
          <FcmManager />
          <ScrollToTop />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
