import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import ArtworksPage from "@/features/artwork/pages/artworks-page";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "Artwork.metadata" });

  return {
    metadataBase: new URL(env.APP_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `${env.APP_URL}/artworks`,
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
      url: `${env.APP_URL}/artworks`,
      title: t("title"),
      description: t("description"),
      siteName: "Myanmar Art Space",
      images: [
        {
          url: `${env.APP_URL}/og-images/opengraph-image.png`,
          width: 1920,
          height: 1080,
          alt: `${t("title")} - Myanmar Art Space`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${env.APP_URL}/og-images/opengraph-image.png`],
    },
  };
}

const ArtWorksRoute = async ({ params }: Props) => {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <Suspense fallback={<LoadingPage />}>
      <ArtworksPage />
    </Suspense>
  );
};

export default ArtWorksRoute;
