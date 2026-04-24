'use client'
import { Fragment, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

import { FilterRow } from "../components/filter-row";
import { FilterSidebar } from "../components/filter-sidebar";
import { FilterIcon, XIcon } from "lucide-react";
import type {
   Artwork,
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
} from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import ArtworkCard from "@/components/app/artwork-card";
import { useInView } from "react-intersection-observer";
import LoadingPage from "@/components/page/loading-page";

interface ArtworksPageViewOptions {
   enableFilters?: boolean;
   enableSorting?: boolean;
}

interface ArtworksPageViewProps {
   title?: string;
   isLoading: boolean;
   isFetching?: boolean;
   pagesToRender: ListApiResponse<Artwork>[];
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
   isSidebarOpen: boolean;
   setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
   sorts: SortingState;
   setSorts: (sorts: SortingState) => void;
   fetchNextPage: () => void;
   hasNextPage: boolean | undefined;
   isFetchingNextPage: boolean;
   removeFromFilter: (filterId: string, key: string) => void;
   artworkCard: (artwork: Artwork) => React.JSX.Element;
   options?: ArtworksPageViewOptions;
}

const ArtworksPageView = ({
   title,
   isLoading,
   isFetching: _isFetching = false,
   pagesToRender,
   filters,
   setFilters,
   sorts,
   setSorts,
   isSidebarOpen,
   setIsSidebarOpen,
   fetchNextPage,
   hasNextPage,
   isFetchingNextPage,
   removeFromFilter,
   artworkCard,
   options = { enableFilters: true, enableSorting: true },
}: ArtworksPageViewProps) => {
   const { ref: loadMoreRef, inView } = useInView({
      threshold: 0,
   });
   const loadingLockRef = useRef(false);
   const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
      if (
         !inView ||
         !hasNextPage ||
         isFetchingNextPage ||
         loadingLockRef.current
      )
         return;

      loadingLockRef.current = true;
      fetchNextPage();
      if (lockTimeoutRef.current) {
         clearTimeout(lockTimeoutRef.current);
      }
      lockTimeoutRef.current = setTimeout(() => {
         loadingLockRef.current = false;
      }, 1000); // throttle 500ms
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   useEffect(() => {
      return () => {
         if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
         }
      };
   }, []);

   return (
      <>
         {/* {isFetching && <UpdatingLoader />} */}
         <div className="flex-grow transition-all duration-300">
            <div className="flex flex-col lg:flex-row transition-all duration-300">
               {/* Sidebar */}
               {options.enableFilters && (
                  <div className="w-full border-0 lg:border border-border p-0 lg:sticky lg:top-0 self-start transition-all duration-300 lg:w-0 lg:overflow-hidden lg:border-none">
                     <FilterSidebar
                        filters={filters}
                        setFilters={setFilters}
                        isSidebarOpen={isSidebarOpen}
                        setIsSidebarOpen={setIsSidebarOpen}
                     />
                  </div>
               )}

               {/* Artworks Grid */}
               <div className="transition-all duration-300 w-full">
                  {options.enableFilters && (
                     <div className="mb-6">
                        <FilterRow filters={filters} setFilters={setFilters} />
                     </div>
                  )}

                  <div className="space-y-4 px-1">
                     {(isLoading) && <Skeleton className="h-9 w-64 rounded-xl" />}
                     {!isLoading && (
                        <div className="flex items-center justify-between mb-2">
                           <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
                              {title ?? "Artworks"}
                           </h1>
                        </div>
                     )}

                     {options.enableFilters && filters.length > 0 && !isLoading && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                           <div className="flex flex-wrap gap-2.5 mb-5 items-center">
                              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mr-1">Active Filters:</span>
                              {filters.map((f) => {
                                 const getFilterLabel = (id: string, val: string) => {
                                    if (id === "status") {
                                       if (val === "AVAILABLE") return "Available";
                                       if (val === "SOLD") return "Sold";
                                       if (val === "NOT_FOR_SALE") return "Not for Sale";
                                       if (val === "SOLD_OUT") return "Sold Out";
                                    }
                                    return val.toLowerCase().replace(/_/g, " ");
                                 };

                                 return (
                                    <Badge
                                       className="bg-primary/5 text-primary border border-primary/10 rounded-full px-3.5 py-1 font-semibold capitalize h-8 flex items-center gap-2 hover:bg-primary/10 transition-colors cursor-default"
                                       key={"artwork-filters-" + f.id + f.value}
                                    >
                                       <span className="truncate max-w-[150px]">
                                          {getFilterLabel(f.id, String(f.value))}
                                       </span>
                                       <button
                                          onClick={() =>
                                             removeFromFilter(f.id, String(f.value))
                                          }
                                          className="p-0.5 hover:bg-primary/20 rounded-full transition-all group/close"
                                          aria-label="Remove filter"
                                       >
                                          <XIcon className="size-3 text-primary/60 group-hover/close:text-primary transition-colors" />
                                       </button>
                                    </Badge>
                                 );
                              })}
                              <Button
                                 variant="link"
                                 size="sm"
                                 className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground hover:text-destructive h-8 px-2 transition-colors"
                                 onClick={() => setFilters([])}
                              >
                                 Clear All
                              </Button>
                           </div>
                        </div>
                     )}

                     {options.enableFilters && filters.length > 0 && isLoading && (
                        <div className="inline-flex flex-wrap gap-2 mb-4">
                           {Array.from({ length: 3 }).map((_, i) => (
                              <Skeleton key={i} className="h-8 w-24 rounded-full" />
                           ))}
                        </div>
                     )}

                     <div className="flex gap-3 items-center justify-end py-1">
                        {options.enableSorting && (
                           <div className="inline-flex gap-3 items-center">
                              <Label className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                                 Sort By
                              </Label>
                              <Select
                                 value={
                                    sorts[0]?.id
                                       ? `${sorts[0]?.id}-${sorts[0]?.desc ? "desc" : "asc"}`
                                       : ""
                                 }
                                 onValueChange={(value) => {
                                    if (!value) return setSorts([]);
                                    const [id, order] = value.split("-");
                                    setSorts([{ id, desc: order === "desc" }]);
                                 }}
                              >
                                 <SelectTrigger
                                    className="w-[180px] h-10 rounded-full bg-white border-2 border-muted/70 shadow-sm hover:border-primary/30 hover:bg-muted/10 transition-all font-bold focus:ring-primary/20"
                                    data-testid="artworks-sort-select"
                                 >
                                    <SelectValue placeholder="Sort by" />
                                 </SelectTrigger>
                                 <SelectContent className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                                    <SelectGroup>
                                       <SelectLabel className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Ordering</SelectLabel>
                                       <SelectItem value="created_at-desc" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                          Date: Newest
                                       </SelectItem>
                                       <SelectItem value="created_at-asc" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                          Date: Oldest
                                       </SelectItem>
                                       <SelectItem value="price-desc" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                          Price: High to Low
                                       </SelectItem>
                                       <SelectItem value="price-asc" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                          Price: Low to High
                                       </SelectItem>
                                    </SelectGroup>
                                 </SelectContent>
                              </Select>
                           </div>
                        )}

                        {options.enableFilters && (
                           <Button
                              variant="outline"
                              onClick={() => setIsSidebarOpen(true)}
                              className="flex items-center gap-2 rounded-full h-10 px-6 bg-background border-2 border-muted/70 shadow-sm hover:!border-primary/30 hover:bg-muted/10 transition-all font-bold"
                           >
                              <FilterIcon className="h-4 w-4" />
                              <span className="hidden md:inline">More Filters</span>
                           </Button>
                        )}
                     </div>

                     <div>
                        {pagesToRender?.[0]?.results?.length <= 0 &&
                           !isLoading && (
                              <div className="flex items-center justify-center h-60">
                                 <p className="text-sm text-muted-foreground font-medium italic">
                                    We couldn't find any artworks matching your selection.
                                 </p>
                              </div>
                           )}
                     </div>

                     {isLoading && <LoadingPage />}

                     <div className="mb-8">
                        <div
                           className={cn(
                              "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-10"
                           )}
                        >
                           {pagesToRender?.map((page) => (
                              <Fragment key={page.next}>
                                 {page.results.map((artwork: Artwork) => (
                                    <div key={artwork.id}>
                                       {artworkCard ? (
                                          artworkCard(artwork)
                                       ) : (
                                          <ArtworkCard
                                             className="w-full"
                                             artwork={artwork}
                                          />
                                       )}
                                    </div>
                                 ))}
                              </Fragment>
                           ))}
                        </div>
                     </div>

                     {/* Infinite scroll sentinel */}
                     {hasNextPage &&
                        !isFetchingNextPage &&
                        pagesToRender?.[0]?.results?.length > 0 && (
                           <div
                              ref={loadMoreRef}
                              className="flex justify-center my-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/50 animate-pulse"
                           >
                              Load More
                           </div>
                        )}

                     {isFetchingNextPage && (
                        <div className="flex justify-center my-8 text-sm font-medium text-muted-foreground">
                           Discovering more masterpieces...
                        </div>
                     )}

                     {!hasNextPage &&
                        !isFetchingNextPage &&
                        pagesToRender?.[0]?.results?.length > 0 && (
                           <div className="flex justify-center my-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                              End of Collection
                           </div>
                        )}
                  </div>
               </div>
            </div>
         </div>
      </>
   );
};

export default ArtworksPageView;
