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

/* ============================================================
 * API CALL
 * ============================================================ */

export const getBlockedUsers = (
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

   return api.get(`/reports/users/blocked/`, { params });

   // return artist;
};

/* ============================================================
 * QUERY OPTIONS (NON-INFINITE)
 * ============================================================ */

export const getBlockedUsersQueryOptions = ({
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
      queryKey: queryKeys.user.blocked.list({ filters, sorts, page, limit }),
      queryFn: () => getBlockedUsers(filters, sorts, page, limit),
   });
};

/* ============================================================
 * INFINITE QUERY HOOK
 * ============================================================ */

type UseBlockedUsersOptions = {
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   search?: string;
   page?: number;
   limit?: number;
   queryConfig?: QueryConfig<any>;
};

export const useGetBlockedUsersInfinite = ({
   filters,
   sorts,
   search,
   limit = 10,
}: UseBlockedUsersOptions = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.user.blocked.infinite({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getBlockedUsers(filters, sorts, pageParam, limit, search),
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

export const useGetBlockedUsers = ({
   queryConfig,
   filters,
   sorts,
   page = 1,
   limit = 10,
}: UseBlockedUsersOptions = {}) => {
   return useQuery({
      ...getBlockedUsersQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
