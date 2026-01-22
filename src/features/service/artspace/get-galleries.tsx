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

export const getGalleriesQueryOptions = (
   options: {
      filters?: ColumnFiltersState;
      sorts?: SortingState;
      page?: number;
      limit?: number;
   } = {}
) => {
   const { filters, sorts, page, limit } = options;
   return queryOptions({
      queryKey: queryKeys.gallery.list({ filters, sorts, page, limit }),
      queryFn: () => getGalleries(filters, sorts, page, limit),
   });
};

// ----------------------------------------------------------------------
// 1. GET GALLERIES (API CALL)
// ----------------------------------------------------------------------

export const getGalleries = (
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

   return api.get(`/users/gallery/`, { params });
};

// ----------------------------------------------------------------------
// 2. CUSTOM HOOK (INFINITE QUERY)
// ----------------------------------------------------------------------

type UseGalleriesOptions = {
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
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
         getGalleries(filters, sorts, pageParam, limit, search),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.data.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      // Add initialPageParam here
      initialPageParam: 1,
   });
};

export const useGetGalleries = ({
   queryConfig,
   filters,
   sorts,
   page = 1,
   limit = 10,
}: UseGalleriesOptions = {}) => {
   return useQuery({
      ...getGalleriesQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
