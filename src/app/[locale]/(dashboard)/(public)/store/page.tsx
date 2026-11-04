import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import StorePage from "@/features/store/pages/store-page";
import type { Metadata } from "next";
import { Suspense } from "react";
import { setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata(): Promise<Metadata> {
  const title = "MAS Store";
  const description =
    "Shop t-shirts, totes, mugs and art books printed with paintings from Myanmar Art Space artists.";

  return {
    metadataBase: new URL(env.APP_URL),
    title,
    description,
    alternates: {
      canonical: `${env.APP_URL}${paths.store.path}`,
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
    openGraph: {
      type: "website",
      url: `${env.APP_URL}${paths.store.path}`,
      title,
      description,
      siteName: "Myanmar Art Space",
      images: [
        {
          url: `${env.APP_URL}/og-images/opengraph-image.png`,
          width: 1920,
          height: 1080,
          alt: `${title} - Myanmar Art Space`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${env.APP_URL}/og-images/opengraph-image.png`],
    },
  };
}

const StoreRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<LoadingPage />}>
      <StorePage />
    </Suspense>
  );
};

export default StoreRoute;
