import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   ColumnFiltersState,
   SortingState,
   ListApiResponse,
   User,
} from "@/types";
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";
import { artist } from "@/mocks/artists";

/* ============================================================
 * API CALL
 * ============================================================ */

export const getArtists = (
   filters: ColumnFiltersState = [],
   sorts: SortingState = [],
   page = 1,
   limit = 10,
   search = ""
): Promise<AxiosResponse<ListApiResponse<User>>> => {
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

   return api.get(`/users/artist/`, { params });

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
      queryFn: () => getArtists(filters, sorts, page, limit),
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
         getArtists(filters, sorts, pageParam, limit, search),
      initialPageParam: 1,
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.data.count;
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
   page = 1,
   limit = 10,
}: UseArtistsOptions = {}) => {
   return useQuery({
      ...getArtistsQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
