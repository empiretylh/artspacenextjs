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
import { XIcon } from "lucide-react";

import ProfileCard from "@/components/app/profile/profile-card";
import { FilterRow } from "@/components/app/user/user-filter-row";
import { EmptyState } from "@/components/layout/empty-state";

import type { ColumnFiltersState, SortingState } from "@/types";
import ArtistsListLoading from "./artists-list-loading";

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

const ArtistsPageView = ({
   title = "Artists",
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

               {isLoading && <ArtistsListLoading />}
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
                                    "grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2"
                                 )}
                              >
                                 {pagesToRender.map((page) => (
                                    <Fragment key={page.data.next}>
                                       {page.data.results.map((artist: any) => (
                                          <ProfileCard
                                             key={artist.id}
                                             user={artist}
                                          />
                                       ))}
                                    </Fragment>
                                 ))}
                              </div>

                              <div className="flex justify-center my-2">
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
                              </div>
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

export default ArtistsPageView;
