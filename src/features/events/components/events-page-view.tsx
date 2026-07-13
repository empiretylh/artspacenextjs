'use client'
import { Fragment, useEffect, useState } from "react";

import { cn } from "@/lib/utils";

import { EmptyState } from "@/components/layout/empty-state";

import type { ColumnFiltersState, Event, SortingState } from "@/types";
import { EventSmallCard } from "./event-small-card";
import EventsListLoading from "./events-list-loading";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "next-intl";

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
   const t = useTranslations("Events");

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
                  <div className="flex items-center justify-between mb-6">
                     <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight">{t("title")}</h1>
                  </div>
               )}

               {isLoading && <EventsListLoading />}
               {!isLoading && (
                  <>
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
                                       {t("loadMore")}
                                    </div>
                                 )}

                              {isFetchingNextPage && (
                                 <div className="flex justify-center my-2 text-sm text-muted-foreground">
                                    {t("loadingMore")}
                                 </div>
                              )}

                              {!hasNextPage &&
                                 !isFetchingNextPage &&
                                 pagesToRender?.[0]?.data?.results?.length > 0 && (
                                    <div className="flex justify-center my-2 text-sm text-muted-foreground">
                                       {t("nothingMore")}
                                    </div>
                                 )}
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
