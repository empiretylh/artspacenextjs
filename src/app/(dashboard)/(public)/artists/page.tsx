import { queryKeys } from "@/config/query-keys";
import ArtistsPage from "@/features/artist/pages/artists-page";
import { getArtists } from "@/features/service/artspace/get-artists";
import { getQueryClient } from "@/lib/get-query-client";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

const ArtistsRoute = async () => {
  const queryClient = getQueryClient();

  // 1. MUST use prefetchInfiniteQuery
  // 2. MUST await the call
  await queryClient.prefetchInfiniteQuery({
    queryKey: queryKeys.artist.infinite({
      // Ensure these match your hook's default props EXACTLY
      limit: 12,
      filters: [],
      sorts: [],
      search: ''
    }),
    queryFn: ({ pageParam = 1 }) =>
      getArtists({
        page: pageParam,
        limit: 12,
        filters: [],
        sorts: [],
        search: ''
      }),
    initialPageParam: 1,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ArtistsPage />
    </HydrationBoundary>
  );
};

export default ArtistsRoute;
