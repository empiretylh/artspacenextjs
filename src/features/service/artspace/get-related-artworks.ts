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
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getRelatedArtworks = (
   artworkId: string,
   filters: ColumnFiltersState = [],
   sorts: SortingState = [],
   page = 1,
   limit = 10,
   search = ""
): Promise<AxiosResponse<ListApiResponse<Artwork>>> => {
   // Default query params
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   params.search = search;

   // Map filters to backend query params
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
            case "price_range": {
               const [min, max] = filter.value
                  .toString()
                  .split("-")
                  .map(Number);

               params.price_min = min;
               params.price_max = max;

               break;
            }
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

   // Map sorting state to backend params
   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   return api.get(`/artworks/uploaded/artwork/${artworkId}/`, { params });
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getRelatedArtworksQueryOptions = (options: {
   artworkId: string;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}) => {
   const { artworkId, filters, sorts, page, limit, search } = options;
   return queryOptions({
      queryKey: queryKeys.artwork.byArtwork.list(artworkId, {
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () =>
         getRelatedArtworks(artworkId, filters, sorts, page, limit, search),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseArtworksOptions = {
   artworkId: string;
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getRelatedArtworksQueryOptions>;
};

export const useGetRelatedArtworks = ({
   artworkId,
   queryConfig,
   filters,
   sorts,
   search,
   page = 1,
   limit = 10,
}: UseArtworksOptions) => {
   return useQuery({
      ...getRelatedArtworksQueryOptions({
         artworkId,
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      ...queryConfig,
   });
};

export const getRelatedArtworksQueryInfiniteOptions = (options: {
   artworkId: string;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}) => {
   const { artworkId, filters, sorts, page, limit, search } = options;
   return queryOptions({
      queryKey: queryKeys.artwork.byArtwork.infinite(artworkId, {
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: () =>
         getRelatedArtworks(artworkId, filters, sorts, page, limit, search),
   });
};

export const useGetRelatedArtworksInfinite = ({
   artworkId,
   filters,
   sorts,
   search,
   limit = 10,
}: UseArtworksOptions) => {
   return useInfiniteQuery({
      queryKey: queryKeys.artwork.byArtwork.infinite(artworkId, {
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getRelatedArtworks(
            artworkId,
            filters,
            sorts,
            pageParam,
            limit,
            search
         ),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.data.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
   });
};
