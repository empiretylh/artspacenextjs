import { Fragment, useEffect, useMemo, useRef } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { XIcon } from "lucide-react";

import ProfileCard from "@/components/app/profile/profile-card";
import { EmptyState } from "@/components/layout/empty-state";

import type { ColumnFiltersState, SortingState } from "@/types";
import { useInView } from "react-intersection-observer";
import UsersListLoading from "./users-list-loading";

interface Props {
   title?: string;
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
}

const UsersPageView = ({
   title = "Users",
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
}: Props) => {
   const resultsCount = useMemo(() => {
      if (!pagesToRender?.length) return 0;
      return pagesToRender.reduce((acc, page) => {
         const results = page?.results ?? page?.data?.results ?? [];
         return acc + (Array.isArray(results) ? results.length : 0);
      }, 0);
   }, [pagesToRender]);

   const { ref: loadMoreRef, inView } = useInView({
      threshold: 0,
   });
   const loadingLock = useRef<boolean>(false);
   const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   useEffect(() => {
      if (!inView || !hasNextPage || isFetchingNextPage || loadingLock.current) return;

      loadingLock.current = true;
      fetchNextPage();
      if (lockTimeoutRef.current) {
         clearTimeout(lockTimeoutRef.current);
      }
      lockTimeoutRef.current = setTimeout(() => {
         loadingLock.current = false;
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
      <section
         className="grow transition-all duration-300"
         aria-labelledby="users-title"
         aria-live="polite"
      >
         <div className="flex flex-col lg:flex-row transition-all duration-300">
            <div className="transition-all duration-300 w-full space-y-3">
               {/* <FilterRow filters={filters} setFilters={setFilters} /> */}

               <div className="flex items-center justify-between mb-6">
                  <h1
                     id="users-title"
                     className="text-2xl sm:text-3xl font-semibold font-display tracking-tight capitalize"
                  >
                     {title}
                  </h1>
               </div>
               <p className="sr-only">
                  Browse profiles. Showing {resultsCount} results.
               </p>

               {filters.length > 0 &&
                  filters.some((f) => f.id !== "price_range") && (
                     <>
                        <span className="inline-block mr-2">SearchBy:</span>
                        <div
                           className="inline-flex flex-wrap gap-2 mb-4"
                           aria-label="Active filters"
                        >
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
                                       aria-label={`Remove filter ${String(
                                          f.value
                                       )}`}
                                    >
                                       <XIcon />
                                    </Button>
                                 </Badge>
                              ))}
                        </div>
                     </>
                  )}

               {isLoading && <UsersListLoading />}
               {!isLoading && (
                  <div className="mb-4" role="region" aria-live="polite">
                     {isDataEmpty() && <EmptyState />}

                     {!isDataEmpty() && (
                        <>
                           <div
                              className={cn(
                                 "grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2"
                              )}
                              role="list"
                              aria-label="User results"
                           >
                              {pagesToRender.map((page) => (
                                 <Fragment key={page.next}>
                                    {(page.results ?? []).map((user: any) => (
                                       <div role="listitem" key={user.id}>
                                          <ProfileCard user={user} />
                                       </div>
                                    ))}
                                 </Fragment>
                              ))}
                           </div>

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
                        </>
                     )}
                  </div>
               )}
            </div>
         </div>
      </section>
   );
};

export default UsersPageView;
