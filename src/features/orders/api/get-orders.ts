import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
   Order,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getOrders = (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10,
   search = ""
): Promise<ListApiResponse<Order>> => {
   // Keep the existing mock logic for general getOrders if needed, 
   // but primarily we want the real API for the user list.
   return api.get(`/orders`, {
      params: {
         filters,
         sorts,
         page,
         limit,
         search,
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
         if (params.search) {
            searchParams.set("search", params.search);
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
      search,
   }: {
      filters?: ColumnFiltersState;
      sorts?: SortingState;
      page?: number;
      limit?: number;
      search?: string;
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
         ? ["orders", formattedFilters, formattedSorts, page, limit, search]
         : ["orders"],
      queryFn: () =>
         getOrders(formattedFilters, formattedSorts, page, limit, search),
   });
};

type UseOrdersOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   search?: string;
   queryConfig?: QueryConfig<typeof getOrdersQueryOptions>;
};

export const useGetOrders = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
   search,
}: UseOrdersOptions) => {
   return useQuery({
      ...getOrdersQueryOptions({ filters, sorts, page, limit, search }),
      ...queryConfig,
   });
};

export const getUserOrders = async (userId: number, filters: Record<string, any> = {}): Promise<Order[]> => {
   const res = await api.get(`/orders/orders/`, {
      params: { user: userId, ...filters },
      paramsSerializer: (params) => {
         const searchParams = new URLSearchParams();
         for (const key in params) {
            const value = params[key];
            if (Array.isArray(value)) {
               value.forEach(v => searchParams.append(key, v));
            } else if (value !== undefined && value !== null) {
               searchParams.append(key, value);
            }
         }
         return searchParams.toString();
      }
   });
   return res.data;
};

export const useGetUserOrders = (userId: number, filters: Record<string, any> = {}) => {
   return useQuery({
      queryKey: ["user-orders", userId, filters],
      queryFn: () => getUserOrders(userId, filters),
      enabled: !!userId,
   });
};

export const getOrder = async (id: string): Promise<Order> => {
   const res = await api.get(`/orders/orders/${id}/`);
   return res.data;
};

export const useGetOrder = (id: string) => {
   return useQuery({
      queryKey: ["order", id],
      queryFn: () => getOrder(id),
      enabled: !!id,
   });
};
