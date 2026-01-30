import { Fragment, useEffect, useState } from "react";

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

               <div className="flex items-center justify-between">
                  <h1 className="text-xl font-bold capitalize">{title}</h1>
               </div>

               {filters.length > 0 &&
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
                  )}

               {isLoading && <UsersListLoading />}
               {!isLoading && (
                  <div className="mb-4">
                     {isDataEmpty() && <EmptyState />}

                     {!isDataEmpty() && (
                        <>
                           <div
                              className={cn(
                                 "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2"
                              )}
                           >
                              {pagesToRender.map((page) => (
                                 <Fragment key={page.next}>
                                    {page.results.map((user: any) => (
                                       <ProfileCard
                                          key={user.id}
                                          user={user}
                                       />
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
      </div>
   );
};

export default UsersPageView;
