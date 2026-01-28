import { queryKeys } from "@/config/query-keys";
import CollectorsPageContainer from "@/features/collectors/pages";
import { getCollectors } from "@/features/service/artspace/get-collectors";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const CollectorsRoute = async () => {
  const queryClient = getQueryClient();

  // 1. MUST use prefetchInfiniteQuery
  // 2. MUST await the call
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: queryKeys.collector.infinite({
  //     // Ensure these match your hook's default props EXACTLY
  //     limit: 12,
  //     filters: [],
  //     sorts: [],
  //     search: ''
  //   }),
  //   queryFn: ({ pageParam = 1 }) =>
  //     getCollectors({
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
    <CollectorsPageContainer />
    // </HydrationBoundary>
  );
};

export default CollectorsRoute;
