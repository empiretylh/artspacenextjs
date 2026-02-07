import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import CollectionsPage from "@/features/collections/pages/collections-page";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Artspace Collections",
  description:
    "Explore Artspace Collections, a curated selection of artworks handpicked by Myanmar Art Space.",
  alternates: {
    canonical: `${env.APP_URL}/arcade`,
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
    "artspace collections",
    "curated artworks",
    "art collection",
    "artists",
    "galleries",
  ],
  openGraph: {
    type: "website",
    url: `${env.APP_URL}/arcade`,
    title: "Artspace Collections",
    description:
      "Explore Artspace Collections, a curated selection of artworks handpicked by Myanmar Art Space.",
    siteName: "Myanmar Art Space",
    images: [
      {
        url: `${env.APP_URL}/og-images/opengraph-image.png`,
        width: 1920,
        height: 1080,
        alt: "Artspace Collections - Myanmar Art Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Artspace Collections",
    description:
      "Explore Artspace Collections, a curated selection of artworks handpicked by Myanmar Art Space.",
    images: [`${env.APP_URL}/og-images/opengraph-image.png`],
  },
};

const CollectionsRoute = async () => {

  // const queryClient = getQueryClient();

  // 1. MUST use prefetchInfiniteQuery
  // 2. MUST await the call
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: queryKeys.artwork.collection.infinite({
  //     // Ensure these match your hook's default props EXACTLY
  //     limit: 10,
  //     search: ''
  //   }),
  //   queryFn: ({ pageParam = 1 }) =>
  //     getArtspaceCollections({
  //       page: pageParam as number,
  //       limit: 10,
  //       search: ''
  //     }),
  //   initialPageParam: 1,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<LoadingPage />}>
      <CollectionsPage />
    </Suspense>
    // </HydrationBoundary>
  )
};

export default CollectionsRoute;
