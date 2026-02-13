import LoadingPage from "@/components/page/loading-page";
import GalleriesPageContainer from "@/features/gallery/pages";
import { getQueryClient } from "@/lib/get-query-client";
import { Suspense } from "react";

const GalleriesRoute = async () => {
  const queryClient = getQueryClient();

  // 1. MUST use prefetchInfiniteQuery
  // 2. MUST await the call
  // await queryClient.prefetchInfiniteQuery({
  //   queryKey: queryKeys.gallery.infinite({
  //     // Ensure these match your hook's default props EXACTLY
  //     limit: 12,
  //     filters: [],
  //     sorts: [],
  //     search: ''
  //   }),
  //   queryFn: ({ pageParam = 1 }) =>
  //     getGalleries({
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
      <GalleriesPageContainer />
    </Suspense>
    // </HydrationBoundary>
  );
};

export default GalleriesRoute;
