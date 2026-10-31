'use client'
import { Fragment, useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
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
import { cn, extractListItems } from "@/lib/utils";

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
import EmptyState from "@/components/common/empty-state";
import type { LucideIcon } from "lucide-react";

interface ArtworksPageViewOptions {
   enableFilters?: boolean;
   enableSorting?: boolean;
}

interface ArtworksPageViewProps {
   title?: string;
   titleClassName?: string;
   isLoading: boolean;
   isFetching?: boolean;
   pagesToRender: (ListApiResponse<Artwork> | Artwork[] | any)[];
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
   priceRanges?: { value: string; label: string; }[];
   emptyTitle?: string;
   emptyDescription?: string;
   emptyIcon?: LucideIcon | React.ReactNode;
   emptyAction?: React.ReactNode;
}

const ArtworksPageView = ({
   title,
   titleClassName,
   emptyTitle,
   emptyDescription,
   emptyIcon,
   emptyAction,
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
   priceRanges = [],
}: ArtworksPageViewProps) => {
   const tCatalog = useTranslations("Artwork.catalog");
   const tFilters = useTranslations("Artwork.filters");
   const { ref: loadMoreRef, inView } = useInView({
      threshold: 0,
   });
   const loadingLockRef = useRef(false);
   const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
   const firstPageArtworks = extractListItems<Artwork>(pagesToRender?.[0]);

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
                     <div className="mb-3 sm:mb-6">
                        <FilterRow filters={filters} setFilters={setFilters} />
                     </div>
                  )}

                  <div className="space-y-3 sm:space-y-4 px-1">
                     {(isLoading) && <Skeleton className="h-9 w-64 rounded-xl" />}
                     {!isLoading && (
                        <div className="flex items-center justify-between mb-3 sm:mb-6">
                           <h2
                              className={cn(
                                 "text-2xl sm:text-3xl font-semibold font-display tracking-tight text-foreground",
                                 titleClassName
                              )}
                           >
                              {title ?? tCatalog("title")}
                           </h2>
                        </div>
                     )}

                     {options.enableFilters && filters.length > 0 && !isLoading && (
                        <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                           <div className="flex flex-wrap gap-2.5 mb-5 items-center">
                              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground mr-1">{tCatalog("activeFilters")}</span>
                              {filters.map((f) => {
                                 const getFilterLabel = (id: string, val: string) => {
                                    if (id === "currency") {
                                       return val.toUpperCase();
                                    }
                                    if (id === "price_range") {
                                       const matched = priceRanges.find((r) => r.value === val);
                                       if (matched) return matched.label;
                                    }
                                    if (id === "price_min") {
                                       const currencyVal = filters.find((fl) => fl.id === "currency")?.value as string || "USD";
                                       const symbol = currencyVal === "MMK" ? "Ks" : "$";
                                       return `${tCatalog("min")}: ${symbol}${val}`;
                                    }
                                    if (id === "price_max") {
                                       const currencyVal = filters.find((fl) => fl.id === "currency")?.value as string || "USD";
                                       const symbol = currencyVal === "MMK" ? "Ks" : "$";
                                       return `${tCatalog("max")}: ${symbol}${val}`;
                                    }
                                    if (id === "status") {
                                       if (val === "AVAILABLE") return tFilters("available");
                                       if (val === "SOLD") return tFilters("sold");
                                       if (val === "NOT_FOR_SALE") return tFilters("notForSale");
                                       if (val === "SOLD_OUT") return tFilters("soldOut");
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
                                          aria-label={tCatalog("removeFilter")}
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
                                 {tCatalog("clearAll")}
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

                     {(options.enableSorting || options.enableFilters) && (
                        <div className="flex gap-2 sm:gap-3 items-center justify-end py-1">
                           {options.enableSorting && (
                              <div className="flex-1 sm:flex-initial inline-flex gap-2 sm:gap-3 items-center">
                                 <Label className="hidden sm:inline-block text-[11px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
                                    {tCatalog("sortBy")}
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
                                       className="w-full sm:w-[180px] h-10 rounded-full bg-background dark:bg-background border border-input shadow-xs text-foreground data-[placeholder]:text-foreground [&_svg]:text-foreground [&_svg]:opacity-100 hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent transition-all font-semibold focus:ring-primary/20 text-xs sm:text-sm"
                                       data-testid="artworks-sort-select"
                                    >
                                       <SelectValue placeholder={tCatalog("sortPlaceholder")} />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border border-border/80 shadow-lg p-1.5 min-w-[180px]">
                                       <SelectGroup>
                                          <SelectLabel className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">{tCatalog("ordering")}</SelectLabel>
                                          <SelectItem value="created_at-desc" className="rounded-lg focus:bg-primary focus:text-primary-foreground cursor-pointer py-1.5">
                                             {tCatalog("sortDateNewest")}
                                          </SelectItem>
                                          <SelectItem value="created_at-asc" className="rounded-lg focus:bg-primary focus:text-primary-foreground cursor-pointer py-1.5">
                                             {tCatalog("sortDateOldest")}
                                          </SelectItem>
                                          <SelectItem value="price-desc" className="rounded-lg focus:bg-primary focus:text-primary-foreground cursor-pointer py-1.5">
                                             {tCatalog("sortPriceHighLow")}
                                          </SelectItem>
                                          <SelectItem value="price-asc" className="rounded-lg focus:bg-primary focus:text-primary-foreground cursor-pointer py-1.5">
                                             {tCatalog("sortPriceLowHigh")}
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
                                 className="flex items-center justify-center gap-2 rounded-full h-10 w-10 sm:w-auto p-0 sm:px-4 shrink-0 bg-background border border-input shadow-xs hover:bg-accent hover:text-accent-foreground transition-all font-semibold"
                                 aria-label={tCatalog("moreFilters")}
                              >
                                 <FilterIcon className="h-4 w-4" />
                                 <span className="hidden sm:inline">{tCatalog("moreFilters")}</span>
                              </Button>
                           )}
                        </div>
                     )}

                     <div>
                        {firstPageArtworks.length <= 0 &&
                           !isLoading && (
                              <div className="py-12">
                                 <EmptyState
                                    icon={emptyIcon}
                                    title={emptyTitle}
                                    description={
                                       emptyDescription ??
                                       tCatalog("empty")
                                    }
                                    action={emptyAction}
                                 />
                              </div>
                           )}
                     </div>

                     {isLoading && <LoadingPage />}

                     <div className="mb-8">
                        <div
                           className={cn(
                              "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-4 gap-y-6 md:gap-y-10"
                           )}
                        >
                           {pagesToRender?.map((page, pageIdx) => {
                              const artworks = extractListItems<Artwork>(page);
                              return (
                                 <Fragment key={(page as any)?.next ?? pageIdx}>
                                    {artworks.map((artwork: Artwork) => (
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
                              );
                           })}
                        </div>
                     </div>

                     {/* Infinite scroll sentinel */}
                     {hasNextPage &&
                        !isFetchingNextPage &&
                        firstPageArtworks.length > 0 && (
                           <div
                              ref={loadMoreRef}
                              className="flex justify-center my-8 text-sm font-bold uppercase tracking-widest text-muted-foreground/50 animate-pulse"
                           >
                              {tCatalog("loadMore")}
                           </div>
                        )}

                     {isFetchingNextPage && (
                        <div className="flex justify-center my-8 text-sm font-medium text-muted-foreground">
                           {tCatalog("loadingMore")}
                        </div>
                     )}

                     {!hasNextPage &&
                        !isFetchingNextPage &&
                        firstPageArtworks.length > 0 && (
                           <div className="flex justify-center my-8 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                              {tCatalog("endOfCollection")}
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
