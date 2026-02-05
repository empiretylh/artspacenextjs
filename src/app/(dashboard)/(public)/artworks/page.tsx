import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import ArtworksPage from "@/features/artwork/pages/artworks-page";
import { getQueryClient } from "@/lib/get-query-client";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Artworks",
  description:
    "Browse curated artworks on Myanmar Art Space and discover new pieces from artists in the community.",
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
    title: "Artworks",
    description:
      "Browse curated artworks on Myanmar Art Space and discover new pieces from artists in the community.",
    siteName: "Myanmar Art Space",
    images: [
      {
        url: `${env.APP_URL}/og-images/opengraph-image.png`,
        width: 1920,
        height: 1080,
        alt: "Artworks - Myanmar Art Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artworks",
    description:
      "Browse curated artworks on Myanmar Art Space and discover new pieces from artists in the community.",
    images: [`${env.APP_URL}/og-images/opengraph-image.png`],
  },
};

const ArtWorksRoute = async () => {
  const queryClient = getQueryClient();

  // 1. MUST use prefetchInfiniteQuery
  // 2. MUST await the call
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: queryKeys.artwork.infinite({
  //     // Ensure these match your hook's default props EXACTLY
  //     page: 1,
  //     limit: 10,
  //     filters: [],
  //     sorts: [],
  //     search: ''
  //   }),
  //   queryFn: ({ pageParam = 1 }) =>
  //     getArtworks({
  //       page: pageParam as number,
  //       limit: 10,
  //       filters: [],
  //       sorts: [],
  //       search: ''
  //     }),
  //   initialPageParam: 1,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<LoadingPage />}>
      <ArtworksPage />
    </Suspense>
    // </HydrationBoundary>
  );
};

export default ArtWorksRoute;
