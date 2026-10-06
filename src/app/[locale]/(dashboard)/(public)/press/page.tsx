import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import BlogPage from "@/features/blog/pages/blog-page";
import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Press & Announcements | Myanmar Art Space",
  description:
    "Official press releases, media coverage, and announcements from Myanmar Art Space.",
  alternates: {
    canonical: `${env.APP_URL}/press`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  keywords: [
    "Myanmar Art Space",
    "Press releases",
    "Media news",
    "Myanmar artists",
    "Art announcements",
    "contemporary art",
    "Yangon art",
  ],
  openGraph: {
    type: "website",
    url: `${env.APP_URL}/press`,
    title: "Press & Announcements | Myanmar Art Space",
    description:
      "Official press releases, media coverage, and announcements from Myanmar Art Space.",
    siteName: "Myanmar Art Space",
    images: [
      {
        url: `${env.APP_URL}/og-images/opengraph-image.png`,
        width: 1920,
        height: 1080,
        alt: "Press & Announcements - Myanmar Art Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Press & Announcements | Myanmar Art Space",
    description:
      "Official press releases, media coverage, and announcements from Myanmar Art Space.",
    images: [`${env.APP_URL}/og-images/opengraph-image.png`],
  },
};

const PressRoute = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<LoadingPage />}>
      <BlogPage />
    </Suspense>
  );
};

export default PressRoute;
