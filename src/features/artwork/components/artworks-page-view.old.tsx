import { Fragment } from "react";
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

interface ArtworksPageViewOptions {
   enableFilters?: boolean;
   enableSorting?: boolean;
}

interface ArtworksPageViewProps {
   title?: string;
   isLoading: boolean;
   pagesToRender: any[];
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
   return (
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
            <div className="transition-all duration-300 w-full space-y-3">
               {options.enableFilters && (
                  <FilterRow filters={filters} setFilters={setFilters} />
               )}

               {isLoading && <Skeleton className="h-7 w-48 rounded-md" />}
               {!isLoading && (
                  <div className="flex items-center justify-between">
                     <h1 className="text-xl font-bold capitalize">
                        {title ?? "Artworks"}
                     </h1>
                  </div>
               )}

               {options.enableFilters && filters.length > 0 && !isLoading && (
                  <>
                     <span className="inline-block mr-2">SearchBy:</span>
                     <div className="inline-flex flex-wrap gap-2 mb-4">
                        {filters.map((f) => (
                           <Badge
                              className="bg-primary/15 text-primary"
                              key={f.id}
                           >
                              {f.value}
                              <Button
                                 onClick={() =>
                                    removeFromFilter(f.id, String(f.value))
                                 }
                                 size="icon"
                                 className="size-4 hover:text-destructive"
                                 variant="link"
                              >
                                 <XIcon />
                              </Button>
                           </Badge>
                        ))}
                        <Button
                           size="xs"
                           className="rounded-full"
                           variant="clean"
                           onClick={() => setFilters([])}
                        >
                           Clear All
                        </Button>
                     </div>
                  </>
               )}

               {options.enableFilters && filters.length > 0 && isLoading && (
                  <div className="inline-flex flex-wrap gap-2 mb-4">
                     {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-6 w-24 rounded-full" />
                     ))}
                  </div>
               )}

               {/* {isLoading && <ArtworkListLoading />} */}
               {
                  <>
                     <div className="flex gap-2 justify-end">
                        {options.enableSorting && (
                           <div className="inline-flex gap-2 items-center justify-between">
                              <Label>
                                 <span>Sort By</span>
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
                                 <SelectTrigger className="w-[180px] h-10">
                                    <SelectValue placeholder="Sort by" />
                                 </SelectTrigger>
                                 <SelectContent>
                                    <SelectItem value="created_at-desc">
                                       Date: Newest
                                    </SelectItem>
                                    <SelectItem value="created_at-asc">
                                       Date: Oldest
                                    </SelectItem>
                                    <SelectItem value="price-desc">
                                       Price: High to Low
                                    </SelectItem>
                                    <SelectItem value="price-asc">
                                       Price: Low to High
                                    </SelectItem>
                                 </SelectContent>
                              </Select>
                           </div>
                        )}

                        {options.enableFilters && (
                           <Button
                              variant="outline"
                              onClick={() => setIsSidebarOpen(true)}
                              className="flex items-center gap-2"
                           >
                              <FilterIcon className="h-5 w-5" />
                              <span className="hidden md:inline">Filters</span>
                           </Button>
                        )}
                     </div>

                     <div>
                        {pagesToRender?.[0]?.data?.results?.length <= 0 && (
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
                                 <>
                                    {page.data.results.map(
                                       (artwork: Artwork) => (
                                          <MasonryItem
                                             key={artwork.id}
                                             artwork={artwork}
                                          >
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
                                       )
                                    )}
                                 </>
                              </Fragment>
                           ))}
                        </div>
                        {pagesToRender?.[0]?.data?.results?.length > 0 && (
                           <div className="flex justify-center my-2">
                              <Button
                                 onClick={() => fetchNextPage()}
                                 disabled={!hasNextPage || isFetchingNextPage}
                              >
                                 {isFetchingNextPage
                                    ? "Loading more..."
                                    : hasNextPage
                                      ? "Load More"
                                      : "Nothing more to load"}
                              </Button>
                           </div>
                        )}
                     </div>
                  </>
               }
            </div>
         </div>
      </div>
   );
};

export default ArtworksPageView;
