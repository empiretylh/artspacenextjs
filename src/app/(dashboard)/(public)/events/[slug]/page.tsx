export const revalidate = 60;

import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import EventDetailPage from "@/features/events/pages/event-detail-page";
import { getEvent } from "@/features/service/artspace/get-event";
import { getEvents } from "@/features/service/artspace/get-events";
import { getQueryClient } from "@/lib/get-query-client";
import { getImage } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata } from "next";
import { cache } from "react";

export async function generateStaticParams() {
  const events = await getEvents({ limit: 10 })

  return events.results.map((event) => ({
    slug: event.slug,
  }))
}

const getCachedEvent = cache((slug: string) => getEvent({ eventSlug: slug }))

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;

  // fetch post information
  const data = await getCachedEvent(slug);
  const canonical = `${env.APP_URL}/events/${slug}`;
  const ogImage = getImage(data.cover_photo);

  return {
    title: data.title,
    description: data.about,
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
      description: data.about,
      siteName: "Myanmar Art Space",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${data.title} - Myanmar Art Space`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: data.title,
      description: data.about,
      images: [ogImage],
    }
  }
}

const EventDetailRoute = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params;
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery({
    queryKey: queryKeys.event.detail(slug),
    queryFn: () => getCachedEvent(slug),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <EventDetailPage />
    </HydrationBoundary>
  );
};

export default EventDetailRoute;
