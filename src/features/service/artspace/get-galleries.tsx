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

export const getGalleries = async ({
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

   const res = await api.get(`/users/gallery/`, { params });

   return res.data;
   // return gallery;
};

/* ============================================================
 * QUERY OPTIONS (NON-INFINITE)
 * ============================================================ */

export const getGalleriesQueryOptions = ({
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
      queryKey: queryKeys.gallery.list({ filters, sorts, page, limit }),
      queryFn: () => getGalleries({ filters, sorts, page, limit }),
   });
};

/* ============================================================
 * INFINITE QUERY HOOK
 * ============================================================ */

type UseGalleriesOptions = {
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   search?: string;
   page?: number;
   limit?: number;
   queryConfig?: QueryConfig<any>;
};

export const useGetGalleriesInfinite = ({
   filters,
   sorts,
   search,
   limit = 10,
}: UseGalleriesOptions = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.gallery.infinite({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getGalleries({ filters, sorts, page: pageParam, limit, search }),
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

export const useGetGalleries = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseGalleriesOptions = {}) => {
   return useQuery({
      ...getGalleriesQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
