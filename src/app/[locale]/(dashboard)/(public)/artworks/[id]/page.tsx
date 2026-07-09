export const revalidate = 60;

import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import ArtworkDetailPage from "@/features/artwork/pages/artwork";
import { getArtwork } from "@/features/service/artspace/get-artwork";
import { getArtworksOg } from "@/features/service/artspace/get-artworks";
import { getQueryClient } from "@/lib/get-query-client";

import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { cache } from "react";

export async function generateStaticParams() {
  const artworks = await getArtworksOg({ limit: 10 })

  return artworks.results.map((artwork) => ({
    id: artwork.id,
  }))
}

const getCachedArtwork = cache((id: string) => getArtwork({ artworkId: id }))

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { id } = await params;

  // fetch post information
  const data = await getCachedArtwork(id);
  const canonical = `${env.APP_URL}/artworks/${id}`;
  // const ogImageUrl = `${env.APP_URL}/artworks/${id}/opengraph-image`;
  const ogImageUrl = `${env.APP_URL}/api/og?id=${id}`;

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
  }
}

const ArtworkDetailRoute = async ({
  params,
}: {
  params: Promise<{ id: string }>
}) => {
  const { id } = await params;
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
