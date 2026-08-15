import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { getUserPath } from "@/lib/utils";
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

export type UserRouteType = "artists" | "galleries" | "collectors" | "buyers";

export const getUsersOg = async (userType: UserRouteType, {
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

   const res = await api.get(`/users/${getUserPath(userType)}/`, { params });

   return res.data;
   // return user;
};

/* ============================================================
 * API CALL
 * ============================================================ */

export const getUsers = async (userType: UserRouteType, {
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

   const res = await api.get(`/users/${getUserPath(userType)}/`, { params });

   return res.data;
   // return user;
};

/* ============================================================
 * QUERY OPTIONS (NON-INFINITE)
 * ============================================================ */

export const getUsersQueryOptions = ({
   userType,
   filters,
   sorts,
   page,
   limit,
}: {
   userType: UserRouteType;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
}) => {
   return queryOptions({
      queryKey: queryKeys.user.list(userType, { filters, sorts, page, limit }),
      queryFn: () => getUsers(userType, { filters, sorts, page, limit }),
   });
};

/* ============================================================
 * INFINITE QUERY HOOK
 * ============================================================ */

type UseUsersOptions = {
   userType: UserRouteType;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   search?: string;
   page?: number;
   limit?: number;
   queryConfig?: QueryConfig<any>;
};

export const useGetUsersInfinite = ({
   userType,
   filters,
   sorts,
   search,
   limit = 10,
}: UseUsersOptions) => {

   return useInfiniteQuery({
      queryKey: queryKeys.user.infinite(userType, {
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getUsers(userType, { filters, sorts, page: pageParam, limit, search }),
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

export const useGetUsers = ({
   queryConfig,
   userType,
   filters,
   sorts,
   page,
   limit,
}: UseUsersOptions) => {
   return useQuery({
      ...getUsersQueryOptions({ userType, filters, sorts, page, limit }),
      ...queryConfig,
   });
};
