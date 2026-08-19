export const revalidate = 60;

import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import ArtworkDetailPage from "@/features/artwork/pages/artwork";
import { getArtwork } from "@/features/service/artspace/get-artwork";
import { getArtworksOg } from "@/features/service/artspace/get-artworks";
import { getQueryClient } from "@/lib/get-query-client";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { cache } from "react";
import { getImage } from "@/lib/utils";

export async function generateStaticParams() {
  const artworks = await getArtworksOg({ limit: 10 })

  return routing.locales.flatMap((locale) =>
    artworks.results.map((artwork) => ({
      locale,
      id: artwork.id,
    }))
  )
}

const getCachedArtwork = cache((id: string) => getArtwork({ artworkId: id }))

type Props = {
  params: Promise<{ locale: string; id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { locale, id } = await params;

  try {
    // fetch post information
    const data = await getCachedArtwork(id);
    const canonical = `${env.APP_URL}/${locale}/artworks/${id}`;
    const ogImageUrl = `${env.APP_URL}/api/og?id=${id}`;
    const directImageUrl = getImage(data.image);

    return {
      title: data.title,
      description: data.description,
      metadataBase: new URL(env.APP_URL),
      alternates: {
        canonical,
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
        url: canonical,
        title: data.title,
        description: data.description,
        siteName: "Myanmar Art Space",
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            type: "image/png",
            alt: `${data.title} - Myanmar Art Space`,
          },
          {
            url: directImageUrl,
            alt: `${data.title} - Myanmar Art Space`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title: data.title,
        description: data.description,
        images: [ogImageUrl],
      }
    };
  } catch (error) {
    console.error("Failed to generate artwork metadata:", error);
    return {
      title: "Artwork - Myanmar Art Space",
      description: "Discover contemporary artwork on Myanmar Art Space",
      metadataBase: new URL(env.APP_URL),
    };
  }
}

const ArtworkDetailRoute = async ({
  params,
}: {
  params: Promise<{ locale: string; id: string }>
}) => {
  const { locale, id } = await params;
  setRequestLocale(locale);
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.artwork.detail(id),
    queryFn: () => getCachedArtwork(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtworkDetailPage id={id} />
    </HydrationBoundary>
  );
};

export default ArtworkDetailRoute;
