import { ScrollToTop } from "@/components/common/scroll-to-top";
import { AuthInitializer } from "@/features/auth/auth-initializer";
import { GoogleAnalytics } from "@next/third-parties/google";
import type { Metadata } from "next";
import { Outfit, Fraunces, Noto_Sans_Myanmar } from "next/font/google";
import "@/app/globals.css";
import AppProvider from "./providers";
import { env } from "@/config/env";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { FcmManager } from "@/features/chat/components/fcm-manager";
import NextTopLoader from "nextjs-toploader";

const outfitSans = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
})

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
})

const notoMyanmar = Noto_Sans_Myanmar({
  variable: "--font-noto-myanmar",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["myanmar"],
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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  // Validate that the incoming locale is supported
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Retrieve translation messages for this request
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${outfitSans.variable} ${fraunces.variable} ${notoMyanmar.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
