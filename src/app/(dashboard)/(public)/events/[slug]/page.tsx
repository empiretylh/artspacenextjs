import { queryKeys } from "@/config/query-keys";
import EventDetailPage from "@/features/events/pages/event-detail-page";
import { getEvent } from "@/features/service/artspace/get-event";
import { getEvents } from "@/features/service/artspace/get-events";
import { getQueryClient } from "@/lib/get-query-client";
import { getImage } from "@/lib/utils";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Metadata, ResolvingMetadata } from "next";
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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params;

  // fetch post information
  const data = await getCachedEvent(slug);

  return {
    title: data.title,
    description: data.about,
    openGraph: {
      images: [getImage(data.cover_photo)],
      title: data.title,
      description: data.about,
    }
  }
}

const EventDetailRoute = async ({
  params,
}: {
  params: Promise<{ slug: string }>
}) => {
  const { slug } = await params;
  // const queryClient = getQueryClient();

  // await queryClient.prefetchQuery({
  //   queryKey: queryKeys.event.detail(id),
  //   queryFn: () => getCachedEvent(id),
  // });

  return (
    // <HydrationBoundary state={dehydrate(queryClient)}>
    <EventDetailPage />
    // </HydrationBoundary>
  );
};

export default EventDetailRoute;
