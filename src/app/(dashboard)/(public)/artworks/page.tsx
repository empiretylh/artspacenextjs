import LoadingPage from "@/components/page/loading-page";
import { queryKeys } from "@/config/query-keys";
import ArtworksPage from "@/features/artwork/pages/artworks-page";
import { getArtworks } from "@/features/service/artspace/get-artworks";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

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
