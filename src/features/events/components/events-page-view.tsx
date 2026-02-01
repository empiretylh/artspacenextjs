'use client'
import { Fragment, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { EmptyState } from "@/components/layout/empty-state";

import type { ColumnFiltersState, Event, SortingState } from "@/types";
import { EventSmallCard } from "./event-small-card";
import EventsListLoading from "./events-list-loading";
import { useInView } from "react-intersection-observer";

interface Props {
   isLoading: boolean;
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
   sorts: SortingState;
   setSorts: (v: SortingState) => void;
   pagesToRender: any[];
   isDataEmpty: () => boolean;
   removeFromFilter: (id: string, key: string) => void;
   fetchNextPage: () => void;
   hasNextPage?: boolean;
   isFetchingNextPage: boolean;
   renderEventCard?: (event: Event) => React.JSX.Element;
   layoutClasses?: string;
   titleOff?: boolean;
}

const EventsPageView = ({
   isLoading,
   filters,
   setFilters,
   sorts,
   setSorts,
   pagesToRender,
   isDataEmpty,
   removeFromFilter,
   fetchNextPage,
   hasNextPage,
   isFetchingNextPage,
   renderEventCard,
   layoutClasses,
   titleOff = false,
}: Props) => {
   const { ref: loadMoreRef, inView } = useInView({
      threshold: 0,
   });
   const [loadingLock, setLoadingLock] = useState(false);

   useEffect(() => {
      if (!inView || !hasNextPage || isFetchingNextPage || loadingLock) return;

      setLoadingLock(true);
      fetchNextPage();
      setTimeout(() => setLoadingLock(false), 1000); // throttle 500ms
   }, [inView, hasNextPage, isFetchingNextPage, loadingLock, fetchNextPage]);

   return (
      <div className="flex-grow transition-all duration-300">
         <div className="flex flex-col lg:flex-row transition-all duration-300">
            <div className="transition-all duration-300 w-full space-y-3">
               {/* <FilterRow filters={filters} setFilters={setFilters} /> */}

               {!titleOff && (
                  <div className="flex items-center justify-between">
                     <h1 className="text-2xl font-bold">Events</h1>
                  </div>
               )}

               {/* {filters.length > 0 &&
                  filters.some((f) => f.id !== "price_range") && (
                     <>
                        <span className="inline-block mr-2">SearchBy:</span>
                        <div className="inline-flex flex-wrap gap-2 mb-4">
                           {filters
                              .filter((f) => f.id !== "price_range")
                              .map((f) => (
                                 <Badge
                                    className="bg-primary/15 text-primary"
                                    key={`${f.id}-${f.value}`}
                                 >
                                    {f.value}
                                    <Button
                                       onClick={() =>
                                          removeFromFilter(
                                             f.id,
                                             String(f.value)
                                          )
                                       }
                                       size="icon"
                                       className="size-4 hover:text-destructive"
                                       variant="link"
                                    >
                                       <XIcon />
                                    </Button>
                                 </Badge>
                              ))}
                        </div>
                     </>
                  )} */}

               {isLoading && <EventsListLoading />}
               {!isLoading && (
                  <>
                     {/* <div className="flex gap-2 justify-end">
                        <div className="inline-flex gap-2 items-center">
                           <Label>Sort By</Label>
                           <Select
                              value={
                                 sorts[0]
                                    ? `${sorts[0].id}-${sorts[0].desc ? "desc" : "asc"}`
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
                     </div> */}
                     <div className="mb-4">
                        {isDataEmpty() && <EmptyState />}

                        {!isDataEmpty() && (
                           <>
                              <div
                                 className={cn(
                                    layoutClasses ? layoutClasses : "grid gap-2"
                                 )}
                              >
                                 {pagesToRender.map((page) => (
                                    <Fragment key={page.next}>
                                       {page.results.map((event: any) => {
                                          if (renderEventCard) {
                                             return (
                                                <div key={"event-" + event.id}>
                                                   {renderEventCard(event)}
                                                </div>
                                             );
                                          } else {
                                             return (
                                                <EventSmallCard
                                                   key={event.id}
                                                   event={event}
                                                />
                                             );
                                          }
                                       })}
                                    </Fragment>
                                 ))}
                              </div>

                              {/* Infinite scroll sentinel */}
                              {hasNextPage &&
                                 !isFetchingNextPage &&
                                 pagesToRender?.[0]?.results?.length > 0 && (
                                    <div
                                       ref={loadMoreRef}
                                       className="flex justify-center my-2 text-sm text-muted-foreground"
                                    >
                                       {" "}
                                       LoadMore
                                    </div>
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

                              {/* <div className="flex justify-center my-2">
                                 <Button
                                    onClick={fetchNextPage}
                                    disabled={
                                       !hasNextPage || isFetchingNextPage
                                    }
                                 >
                                    {isFetchingNextPage
                                       ? "Loading more..."
                                       : hasNextPage
                                          ? "Load More"
                                          : "Nothing more to load"}
                                 </Button>
                              </div> */}
                           </>
                        )}
                     </div>
                  </>
               )}
            </div>
         </div>
      </div>
   );
};

export default EventsPageView;
