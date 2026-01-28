import { queryKeys } from "@/config/query-keys";
import CollectionsPage from "@/features/collections/pages/collections-page";
import { getArtspaceCollections } from "@/features/service/artspace/get-artspace-collections";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

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
    <CollectionsPage />
    // </HydrationBoundary>
  )
};

export default CollectionsRoute;
