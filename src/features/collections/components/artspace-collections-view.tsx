import { Fragment, useEffect, useState } from "react";


import { cn } from "@/lib/utils";

import type { Artwork } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArtworkCard from "@/components/app/artwork-card";
import { useInView } from "react-intersection-observer";
import { EmptyState } from "@/components/layout/empty-state";

interface ArtspaceCollectionsViewOptions {
   enableFilters?: boolean;
   enableSorting?: boolean;
}

interface ArtspaceCollectionsViewProps {
   title?: string;
   isLoading: boolean;
   pagesToRender: any[];
   fetchNextPage: () => void;
   hasNextPage: boolean | undefined;
   isFetchingNextPage: boolean;
   artworkCard: (artwork: Artwork) => React.JSX.Element;
   options?: ArtspaceCollectionsViewOptions;
}

const ArtspaceCollectionsView = ({
   title,
   isLoading,
   pagesToRender,
   fetchNextPage,
   hasNextPage,
   isFetchingNextPage,
   artworkCard,
}: ArtspaceCollectionsViewProps) => {
   const { ref: loadMoreRef, inView } = useInView({
      threshold: 0,
   });
   const [loadingLock, setLoadingLock] = useState(false);

   useEffect(() => {
      if (!inView || !hasNextPage || isFetchingNextPage || loadingLock) return;

      setLoadingLock(true);
      fetchNextPage();
      setTimeout(() => setLoadingLock(false), 500); // throttle 500ms
   }, [inView, hasNextPage, isFetchingNextPage, loadingLock, fetchNextPage]);

   return (
      <div className="flex-grow transition-all duration-300">
         <div className="flex flex-col lg:flex-row transition-all duration-300">
            {/* Artworks Grid */}
            <div className="transition-all duration-300 w-full space-y-3">
               {isLoading && <Skeleton className="h-7 w-48 rounded-md" />}

               <div>
                  {pagesToRender?.[0]?.results?.length <= 0 &&
                     !isLoading && <EmptyState />}
               </div>

               <div className="mb-4">
                  <div
                     className={cn(
                        "",
                        "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 h-full"
                     )}
                  >
                     {pagesToRender?.map((page) => (
                        <Fragment key={page.next}>
                           {page.results.map(
                              (artwork: { id: number; artwork: Artwork }) => (
                                 <Fragment key={artwork.id}>
                                    {artworkCard ? (
                                       artworkCard(artwork.artwork)
                                    ) : (
                                       <ArtworkCard
                                          className="w-full"
                                          artwork={artwork.artwork}
                                       />
                                    )}
                                 </Fragment>
                              )
                           )}
                        </Fragment>
                     ))}
                  </div>

                  {/* Infinite scroll sentinel */}
                  {hasNextPage &&
                     !isFetchingNextPage &&
                     pagesToRender?.[0]?.results?.length > 0 && (
                        <div ref={loadMoreRef} className="h-1" />
                     )}

                  {isFetchingNextPage && (
                     <div className="flex justify-center my-2 text-sm text-muted-foreground">
                        Loading more...
                     </div>
                  )}

                  {!hasNextPage &&
                     !isFetchingNextPage &&
                     pagesToRender?.[0]?.results?.length > 0 && (
                        <div className="flex justify-center my-2 text-sm text-muted-foreground">
                           Nothing more to load
                        </div>
                     )}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ArtspaceCollectionsView;
