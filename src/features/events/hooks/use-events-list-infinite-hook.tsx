import { useEffect, useMemo, useState } from "react";
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import debounce from "lodash/debounce";
import { keepPreviousData } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

import type {
   ColumnFiltersState,
   Event,
   ListApiResponse,
   SortingState,
} from "@/types";

import { useGetEventsInfinite } from "@/features/service/artspace/get-events";

export const useEventsListInfinite = () => {
   const searchParams = useSearchParams();
   const pathname = usePathname();
   const { replace } = useRouter();
   // -----------------------------------------
   // State
   // -----------------------------------------
   const [oldData, setOldData] = useState<
      AxiosResponse<ListApiResponse<Event>, any>[]
   >([]);

   const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
   const [limit, setLimit] = useState(Number(searchParams.get("limit")) || 12);

   const [globalFilter, setGlobalFilter] = useState({
      search: searchParams.get("search") || "",
   });

   const [filters, setFilters] = useState<ColumnFiltersState>(
      searchParams.get("filters")
         ? JSON.parse(searchParams.get("filters")!)
         : []
   );

   const [sorts, setSorts] = useState<SortingState>(
      searchParams.get("sorts") ? JSON.parse(searchParams.get("sorts")!) : []
   );

   const [debouncedSearch, setDebouncedSearch] = useState(globalFilter.search);

   // -----------------------------------------
   // Fetch
   // -----------------------------------------
   const { isLoading, data, fetchNextPage, hasNextPage, isFetchingNextPage } =
      useGetEventsInfinite({
         search: searchParams.get("search") || "",
         filters: [...filters].filter(Boolean) as ColumnFiltersState,
         sorts,
         limit,
         queryConfig: {
            placeholderData: keepPreviousData,
         },
      });

   useEffect(() => {
      if (!isLoading && data) setOldData(data.pages);
   }, [data, isLoading]);

   const pagesToRender = isLoading ? oldData : data?.pages || [];

   // -----------------------------------------
   // Debounce
   // -----------------------------------------
   const debouncedSetSearch = useMemo(
      () =>
         debounce((value: string) => {
            setDebouncedSearch(value);
            setPage(1);
         }, 500),
      []
   );

   const handleSearchChange = (value: string) => {
      setGlobalFilter({ search: value });
      debouncedSetSearch(value);
   };

   // -----------------------------------------
   // Helpers
   // -----------------------------------------
   const buildParams = () => {
      const params: Record<string, string> = {};

      if (page !== 1) params.page = page.toString();
      if (limit !== 12) params.limit = limit.toString();
      if (globalFilter.search) params.search = globalFilter.search;

      return params;
   };

   const removeFromFilter = (filterId: string, key: string) => {
      setFilters((prev) =>
         prev.filter((f) =>
            f.id === filterId ? String(f.value) !== String(key) : true
         )
      );
   };

   // -----------------------------------------
   // Sync URL from state
   // -----------------------------------------
   useEffect(() => {
      const params = buildParams();
      const filterGroups: Record<string, Set<string>> = {};

      for (const filter of filters) {
         if (filter.id && filter.value) {
            if (!filterGroups[filter.id]) {
               filterGroups[filter.id] = new Set();
            }
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
               : Array.from(values).join("+");
      });

      if (sorts.length > 0) {
         params.sort = `${sorts[0].id}-${sorts[0].desc ? "desc" : "asc"}`;
      }

      replace(`${pathname}?${decodeURI(
         Object.entries(params)
            .map(([k, v]) => `${k}=${v}`)
            .join("&")
      )}`);
   }, [page, limit, debouncedSearch, filters, sorts]);

   // -----------------------------------------
   // Parse URL on mount
   // -----------------------------------------
   useEffect(() => {
      const newPage = Number(searchParams.get("page")) || 1;
      const newLimit = Number(searchParams.get("limit")) || 12;
      const newSearch = searchParams.get("search") || "";

      const newFilters: ColumnFiltersState = [];

      searchParams.forEach((value, key) => {
         if (!["page", "limit", "search", "sort"].includes(key)) {
            if (key === "price_range") {
               if (value) newFilters.push({ id: key, value });
            } else {
               String(value)
                  .split(" ")
                  .forEach((v) => {
                     if (v) newFilters.push({ id: key, value: Number(v) });
                  });
            }
         }
      });

      const sortParam = searchParams.get("sort");
      const newSorts: SortingState = [];

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
   }, []);

   const isDataEmpty = () => pagesToRender[0]?.data?.results?.length <= 0;

   // -----------------------------------------
   // Public API
   // -----------------------------------------
   return {
      // data
      pagesToRender,
      isLoading,
      isFetchingNextPage,
      hasNextPage,

      // filters & sorting
      filters,
      setFilters,
      sorts,
      setSorts,
      removeFromFilter,

      // pagination
      fetchNextPage,

      // search
      globalFilter,
      handleSearchChange,

      // helpers
      isDataEmpty,
   };
};
