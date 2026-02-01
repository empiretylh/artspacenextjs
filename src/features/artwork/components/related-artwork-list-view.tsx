import { Fragment, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import MasonryItem from "../../../components/app/masonry-item";
import { FilterRow } from "../components/filter-row";
import { FilterSidebar } from "../components/filter-sidebar";
import { FilterIcon, XIcon } from "lucide-react";
import type { Artwork, ColumnFiltersState, SortingState } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArtworkCard from "@/components/app/artwork-card";
import { useInView } from "react-intersection-observer";

interface RelatedArtworksListViewOptions {
   enableFilters?: boolean;
   enableSorting?: boolean;
}

interface RelatedArtworksListViewProps {
   title?: string;
   isLoading: boolean;
   pagesToRender: any[];
   fetchNextPage: () => void;
   hasNextPage: boolean | undefined;
   isFetchingNextPage: boolean;
   artworkCard: (artwork: Artwork) => React.JSX.Element;
   options?: RelatedArtworksListViewOptions;
}

const RelatedArtworksListView = ({
   title,
   isLoading,
   pagesToRender,
   fetchNextPage,
   hasNextPage,
   isFetchingNextPage,
   artworkCard,
}: RelatedArtworksListViewProps) => {
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
               {/* {isLoading && <Skeleton className="h-7 w-48 rounded-md" />} */}

               <div>
                  {pagesToRender?.[0]?.data?.results?.length <= 0 &&
                     !isLoading && (
                        <div className="flex items-center justify-center h-40">
                           <p className="text-sm text-muted-foreground">
                              No results found
                           </p>
                        </div>
                     )}
               </div>

               <div className="mb-4">
                  <div
                     className={cn(
                        "",
                        "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-2 auto-rows-[1px] h-full"
                     )}
                  >
                     {pagesToRender?.map((page) => (
                        <Fragment key={page.data.next}>
                           {page.data.results.map((artwork: Artwork) => (
                              <MasonryItem key={artwork.id} artwork={artwork}>
                                 {artworkCard ? (
                                    artworkCard(artwork)
                                 ) : (
                                    <ArtworkCard
                                       variant="masonry"
                                       className="inline-block w-full h-auto"
                                       artwork={artwork}
                                    />
                                 )}
                              </MasonryItem>
                           ))}
                        </Fragment>
                     ))}
                  </div>

                  {/* Infinite scroll sentinel */}
                  {hasNextPage &&
                     !isFetchingNextPage &&
                     pagesToRender?.[0]?.data?.results?.length > 0 && (
                        <div ref={loadMoreRef} className="h-1" />
                     )}

                  {isFetchingNextPage && (
                     <div className="flex justify-center my-2 text-sm text-muted-foreground">
                        Loading more...
                     </div>
                  )}

                  {!hasNextPage &&
                     !isFetchingNextPage &&
                     pagesToRender?.[0]?.data?.results?.length > 0 && (
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

export default RelatedArtworksListView;
