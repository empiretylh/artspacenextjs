import LoadingPage from "@/components/page/loading-page";
import { queryKeys } from "@/config/query-keys";
import EventPage from "@/features/events/pages/events-page";
import { getEvents } from "@/features/service/artspace/get-events";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

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
