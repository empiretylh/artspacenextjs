import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import EventPage from "@/features/events/pages/events-page";
import { getEvents } from "@/features/service/artspace/get-events";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Events",
  description:
    "Discover Myanmar Art Space events, exhibitions, and community gatherings.",
  alternates: {
    canonical: `${env.APP_URL}/events`,
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
    "events",
    "exhibitions",
    "art events",
    "community",
    "galleries",
  ],
  openGraph: {
    type: "website",
    url: `${env.APP_URL}/events`,
    title: "Events",
    description:
      "Discover Myanmar Art Space events, exhibitions, and community gatherings.",
    siteName: "Myanmar Art Space",
    images: [
      {
        url: `${env.APP_URL}/og-images/opengraph-image.png`,
        width: 1920,
        height: 1080,
        alt: "Events - Myanmar Art Space",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Events",
    description:
      "Discover Myanmar Art Space events, exhibitions, and community gatherings.",
    images: [`${env.APP_URL}/og-images/opengraph-image.png`],
  },
};

const EventsRoute = async () => {
  const queryClient = getQueryClient();

  // 1. MUST use prefetchInfiniteQuery
  // 2. MUST await the call
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: queryKeys.event.infinite({
  //     // Ensure these match your hook's default props EXACTLY
  //     limit: 12,
  //     filters: [],
  //     sorts: [],
  //     search: ''
  //   }),
  //   queryFn: ({ pageParam = 1 }) =>
  //     getEvents({
  //       page: pageParam,
  //       limit: 12,
  //       filters: [],
  //       sorts: [],
  //       search: ''
  //     }),
  //   initialPageParam: 1,
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <Suspense fallback={<LoadingPage />}>
      <EventPage />
    </Suspense>
    // </HydrationBoundary>
  );
};

export default EventsRoute;
