'use client'
import { useEffect, useMemo, useRef, useState } from "react";
import debounce from "lodash/debounce";
import { keepPreviousData } from "@tanstack/react-query";
import type {
   Artwork,
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
} from "@/types";
import type { AxiosResponse } from "axios";
import ArtworksPageView from "./artworks-page-view";
import { useGetArtworksInfinite } from "@/features/service/artspace/get-artworks";
import ArtworkCard from "@/components/app/artwork-card";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

const ArtworksPageContainer = () => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();

   // State
   const [oldData, setOldData] = useState<ListApiResponse<Artwork>[]>([]);
   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
   const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 10);
   const [globalFilter, setGlobalFilter] = useState({
      search: searchParams.get("search") || "",
   });
   const isHydrated = useRef(false);

   const [filters, setFilters] = useState<ColumnFiltersState>(
      searchParams.get("filters")
         ? JSON.parse(searchParams.get("filters")!)
         : []
   );
   const [sorts, setSorts] = useState<SortingState>(
      searchParams.get("sorts") ? JSON.parse(searchParams.get("sorts")!) : []
   );
   const [debouncedSearch, setDebouncedSearch] = useState(globalFilter.search);
   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

   // Fetch Artworks
   const {
      isLoading,
      data,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      isFetching,
   } = useGetArtworksInfinite({
      page,
      search: searchParams.get("search") || "",
      filters: [...filters].filter(Boolean) as ColumnFiltersState,
      sorts,
      limit,
      // queryConfig: { placeholderData: keepPreviousData },
   });

   useEffect(() => {
      if (!isLoading && data) setOldData(data.pages);
   }, [data, isLoading]);

   const pagesToRender = isLoading ? oldData : data?.pages || [];

   const removeFromFilter = (filterId: string, key: string) => {
      setFilters((prev) =>
         prev.filter((f) =>
            f.id === filterId ? String(f.value) !== String(key) : true
         )
      );
   };

   const buildParams = () => {
      const params: Record<string, string> = {};
      if (page && page !== 1) params.page = page.toString();
      if (limit && limit !== 10) params.limit = limit.toString();
      if (globalFilter.search) params.search = globalFilter.search;

      const filterGroups: Record<string, Set<string>> = {};
      for (const filter of filters) {
         if (filter.id && filter.value) {
            if (!filterGroups[filter.id]) filterGroups[filter.id] = new Set();
            filterGroups[filter.id].add(String(filter.value));
         }
      }

      if (filters.some((f) => f.id === "price_range")) {
         const priceFilters = filters.filter((f) => f.id === "price_range");
         filterGroups["price_range"] = new Set([
            String(priceFilters.at(-1)?.value),
         ]);
      }

      Object.entries(filterGroups).forEach(([key, values]) => {
         params[key] =
            key === "price_range"
               ? Array.from(values)[0]
               : Array.from(values).join(",");
      });

      if (sorts.length > 0) {
         params.sort = `${sorts[0].id}-${sorts[0].desc ? "desc" : "asc"}`;
      }

      return params;
   };

   // Update URL when state changes
   useEffect(() => {
      if (isHydrated.current) {
         const params = buildParams();
         replace(`${pathname}?${Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")}`);
      }
   }, [page, limit, debouncedSearch, filters, sorts]);

   // Parse URL on mount
   useEffect(() => {
      const newPage = Number(searchParams.get("page")) || 1;
      const newLimit = Number(searchParams.get("limit")) || 10;
      const newSearch = searchParams.get("search") || "";
      const newFilters: ColumnFiltersState = [];

      searchParams.forEach((value, key) => {
         if (!["page", "limit", "search", "sort"].includes(key)) {
            if (key === "price_range") {
               if (value) newFilters.push({ id: key, value });
            } else {
               console.log(value);
               const values = String(value).split(",");
               console.log(values);
               values.forEach((v) => {
                  if (v) newFilters.push({ id: key, value: v });
               });
            }
         }
      });

      const newSorts: SortingState = [];
      const sortParam = searchParams.get("sort");
      if (sortParam) {
         const [id, order] = sortParam.split("-");
         newSorts.push({ id, desc: order === "desc" });
      }

      setPage(newPage);
      setLimit(newLimit);
      setGlobalFilter({ search: newSearch });
      setDebouncedSearch(newSearch);
      setFilters(newFilters);
      setSorts(newSorts);

      isHydrated.current = true;
   }, []);

   return (
      <ArtworksPageView
         artworkCard={(artwork: Artwork) => {
            return (
               <ArtworkCard
                  variant="masonry"
                  className="inline-block w-full h-auto"
                  artwork={artwork}
               />
            );
         }}
         isLoading={isLoading}
         isFetching={isFetching}
         pagesToRender={pagesToRender}
         filters={filters}
         setFilters={setFilters}
         sorts={sorts}
         setSorts={setSorts}
         isSidebarOpen={isSidebarOpen}
         setIsSidebarOpen={setIsSidebarOpen}
         fetchNextPage={fetchNextPage}
         hasNextPage={hasNextPage}
         isFetchingNextPage={isFetchingNextPage}
         removeFromFilter={removeFromFilter}
      />
   );
};

export default ArtworksPageContainer;
