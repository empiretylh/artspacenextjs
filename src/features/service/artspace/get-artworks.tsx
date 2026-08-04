import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   ColumnFiltersState,
   Artwork,
   SortingState,
   ListApiResponse,
} from "@/types";
import { queryKeys } from "@/config/query-keys";

export const getArtworksOg = async ({
   filters = [],
   sorts = [],
   page,
   limit,
   search = ""
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string }): Promise<ListApiResponse<Artwork>> => {
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   params.search = search;

   filters?.forEach((filter) => {
      if (
         filter.value !== undefined &&
         filter.value !== null &&
         filter.value !== ""
      ) {
         switch (filter.id) {
            case "price_min":
            case "price_max":
            case "year":
            case "page":
            case "page_size":
               params[filter.id] = Number(filter.value);
               break;

            case "price_range":
               if (params.price_range) {
                  params.price_range = `${params.price_range},${filter.value}`;
               } else {
                  params.price_range = String(filter.value);
               }
               break;

            default:
               if (params[filter.id]) {
                  if (Array.isArray(params[filter.id])) {
                     params[filter.id].push(filter.value);
                  } else {
                     params[filter.id] = [params[filter.id], filter.value];
                  }
               } else {
                  params[filter.id] = filter.value;
               }
               break;
         }
      }
   });

   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   const res = await api.get(`/artworks/artworks/`, { params });

   return res.data
};

// ----------------------------------------------------------------------
// 1. GET ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getArtworks = async ({
   filters = [],
   sorts = [],
   page,
   limit,
   search = ""
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string }): Promise<ListApiResponse<Artwork>> => {
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   params.search = search;

   filters?.forEach((filter) => {
      if (
         filter.value !== undefined &&
         filter.value !== null &&
         filter.value !== ""
      ) {
         switch (filter.id) {
            case "price_min":
            case "price_max":
            case "year":
            case "page":
            case "page_size":
               params[filter.id] = Number(filter.value);
               break;

            case "price_range":
               if (params.price_range) {
                  params.price_range = `${params.price_range},${filter.value}`;
               } else {
                  params.price_range = String(filter.value);
               }
               break;

            default:
               if (params[filter.id]) {
                  if (Array.isArray(params[filter.id])) {
                     params[filter.id].push(filter.value);
                  } else {
                     params[filter.id] = [params[filter.id], filter.value];
                  }
               } else {
                  params[filter.id] = filter.value;
               }
               break;
         }
      }
   });

   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   const res = await api.get(`/artworks/artworks/`, { params });

   return res.data
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getArtworksQueryOptions = (
   options: {
      filters?: ColumnFiltersState;
      sorts?: SortingState;
      page?: number;
      limit?: number;
      search?: string;
   } = {}
) => {
   const { filters, sorts, page, limit, search } = options;

   return queryOptions({
      queryKey: queryKeys.artwork.list({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () => getArtworks({ filters, sorts, page, limit, search }),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseArtworksOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getArtworksQueryOptions>;
};

export const useGetArtworks = ({
   queryConfig,
   filters,
   sorts,
   search,
   page,
   limit,
}: UseArtworksOptions = {}) => {
   return useQuery({
      ...getArtworksQueryOptions({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 4. INFINITE QUERY
// ----------------------------------------------------------------------

export const useGetArtworksInfinite = ({
   filters,
   sorts,
   search,
   page,
   limit = 10,
}: UseArtworksOptions = {}) => {

   return useInfiniteQuery({
      queryKey: queryKeys.artwork.infinite({
         filters,
         sorts,
         search,
         page,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getArtworks({ filters, sorts, page: pageParam, limit, search }),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
   });
};
