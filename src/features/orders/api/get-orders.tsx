import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   ColumnFiltersState,
   ListApiResponse,
   Order,
   SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getOrders = (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10
): Promise<ListApiResponse<Order>> => {
   return api.get(`/orders`, {
      params: {
         filters,
         sorts,
         page,
         limit,
      },
      paramsSerializer: (params) => {
         const searchParams = new URLSearchParams();
         for (const key in params.sorts) {
            searchParams.append(`sort[${key}]`, params.sorts[key]);
         }
         for (const field in params.filters) {
            const value = params.filters[field];
            if (typeof value === "object") {
               for (const op in value) {
                  searchParams.append(`filter[${field}][${op}]`, value[op]);
               }
            } else {
               searchParams.append(`filter[${field}]`, value);
            }
         }
         if (params.page) {
            searchParams.set("page", params.page.toString());
         }
         if (params.limit) {
            searchParams.set("limit", params.limit.toString());
         }
         return searchParams.toString();
      },
   });
};

export const getOrdersQueryOptions = (
   {
      filters,
      sorts,
      page,
      limit,
   }: {
      filters?: ColumnFiltersState;
      sorts?: SortingState;
      page?: number;
      limit?: number;
   } = { page: 1, limit: 10 }
) => {
   const formattedFilters: Record<string, unknown> = {};
   const formattedSorts: Record<string, unknown> = {};

   sorts?.forEach((sort) => {
      formattedSorts[sort.id] = sort.desc ? "desc" : "asc";
   });

   filters?.forEach((filter) => {
      if (filter.id === "deletedAt") {
         formattedFilters["deletedAt"] =
            filter.value === "deleted"
               ? {
                    not: null,
                 }
               : null;
      } else {
         formattedFilters[filter.id] = filter.value;
      }
   });

   return queryOptions({
      queryKey: filters
         ? ["orders", formattedFilters, formattedSorts, page, limit]
         : ["orders"],
      queryFn: () => getOrders(formattedFilters, formattedSorts, page, limit),
   });
};

type UseOrdersOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
};

export const useGetOrders = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseOrdersOptions = {}) => {
   return useQuery({
      ...getOrdersQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
