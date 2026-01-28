import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
   User,
} from "@/types";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";

export const getArtistsOg = async ({
   filters = [],
   sorts = [],
   page,
   limit = 10,
   search = ""
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string }): Promise<ListApiResponse<User>> => {
   const params: Record<string, any> = { page, limit, search };

   filters?.forEach((filter) => {
      if (
         filter.value !== undefined &&
         filter.value !== null &&
         filter.value !== ""
      ) {
         if (params[filter.id]) {
            if (Array.isArray(params[filter.id])) {
               params[filter.id].push(filter.value);
            } else {
               params[filter.id] = [params[filter.id], filter.value];
            }
         } else {
            params[filter.id] = filter.value;
         }
      }
   });

   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   const res = await api.get(`/users/artist/`, { params });

   return res.data;
   // return artist;
};

/* ============================================================
 * API CALL
 * ============================================================ */

export const getArtists = async ({
   filters = [],
   sorts = [],
   page,
   limit = 10,
   search = ""
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string }): Promise<ListApiResponse<User>> => {
   const params: Record<string, any> = { page, limit, search };

   filters?.forEach((filter) => {
      if (
         filter.value !== undefined &&
         filter.value !== null &&
         filter.value !== ""
      ) {
         if (params[filter.id]) {
            if (Array.isArray(params[filter.id])) {
               params[filter.id].push(filter.value);
            } else {
               params[filter.id] = [params[filter.id], filter.value];
            }
         } else {
            params[filter.id] = filter.value;
         }
      }
   });

   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   const res = await api.get(`/users/artist/`, { params });

   return res.data;
   // return artist;
};

/* ============================================================
 * QUERY OPTIONS (NON-INFINITE)
 * ============================================================ */

export const getArtistsQueryOptions = ({
   filters,
   sorts,
   page,
   limit,
}: {
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
}) => {
   return queryOptions({
      queryKey: queryKeys.artist.list({ filters, sorts, page, limit }),
      queryFn: () => getArtists({ filters, sorts, page, limit }),
   });
};

/* ============================================================
 * INFINITE QUERY HOOK
 * ============================================================ */

type UseArtistsOptions = {
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   search?: string;
   page?: number;
   limit?: number;
   queryConfig?: QueryConfig<any>;
};

export const useGetArtistsInfinite = ({
   filters,
   sorts,
   search,
   limit = 10,
}: UseArtistsOptions = {}) => {

   return useInfiniteQuery({
      queryKey: queryKeys.artist.infinite({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getArtists({ filters, sorts, page: pageParam, limit, search }),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
   });
};

/* ============================================================
 * STANDARD (NON-INFINITE) QUERY HOOK
 * ============================================================ */

export const useGetArtists = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseArtistsOptions = {}) => {
   return useQuery({
      ...getArtistsQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
