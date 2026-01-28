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
import { dummyArtworks } from "@/features/collections/data/dummy-artworks";

// ----------------------------------------------------------------------
// 1. GET ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getArtspaceCollections = async ({
   filters = [],
   sorts = [],
   page,
   limit,
   search = ""
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string }): Promise<ListApiResponse<{ id: number; artwork: Artwork }>> => {
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   params.search = search;

   const res = await api.get(`/artworks/mmartspace-collected-artworks/`, { params });

   return res.data;
   // return dummyArtworks;
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getArtspaceCollectionsQueryOptions = (
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
      queryKey: queryKeys.artwork.collection.list({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () =>
         getArtspaceCollections({ filters, sorts, page, limit, search }),
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
   queryConfig?: QueryConfig<typeof getArtspaceCollectionsQueryOptions>;
};

export const useGetArtspaceCollections = ({
   queryConfig,
   filters,
   sorts,
   search,
   page,
   limit,
}: UseArtworksOptions = {}) => {
   return useQuery({
      ...getArtspaceCollectionsQueryOptions({
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

export const useGetArtspaceCollectionsInfinite = ({
   filters,
   sorts,
   search,
   limit = 10,
}: UseArtworksOptions = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.artwork.collection.infinite({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getArtspaceCollections({ filters, sorts, page: pageParam, limit, search }),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
   });
};
