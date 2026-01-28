import { ScrollToTop } from "@/components/common/scroll-to-top";
import { AuthInitializer } from "@/features/auth/auth-initializer";
import type { Metadata } from "next";
import { Outfit, Space_Grotesk } from "next/font/google";
import "./globals.css";
import AppProvider from "./providers";
import { GoogleAnalytics } from "@next/third-parties/google";

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
        {/* <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID as string} /> */}
        <AuthInitializer />
        <AppProvider>
          <ScrollToTop />
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
