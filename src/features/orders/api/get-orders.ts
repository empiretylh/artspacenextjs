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
   const mockOrders: Order[] = Array.from({ length: 20 }).map((_, i) => {
      const statusOptions: Order["status"][] = ["PENDING", "COMPLETED", "FAILED", "SHIPPED"];
      const currentStatus = statusOptions[i % 4];
      const date = new Date(2026, 0, i + 1);

      return {
         id: `ord_${1000 + i}`,
         buyerId: 200 + i,
         buyer: {
            id: 200 + i,
            first_name: `User `,
            last_name: `${i + 1}`,
            email: `user${i + 1}@example.com`,
         } as any, // Cast to any if User interface is more complex
         total_price: parseFloat((Math.random() * 500 + 20).toFixed(2)),
         shipping_address: `${100 + i} Innovation Way, Tech City, 90210`,
         stripe_session_id: currentStatus !== "PENDING" ? `cs_test_${Math.random().toString(36).substring(7)}` : null,
         status: currentStatus,
         paid_at: currentStatus === "COMPLETED" || currentStatus === "SHIPPED" ? date : null,
         created_at: date,
         updated_at: new Date(2026, 0, i + 2),
         items: [
            {
               id: `item_${i}_1`,
               orderId: `ord_${1000 + i}`,
               productId: i + 50,
               quantity: Math.floor(Math.random() * 3) + 1,
               price: 25.00
            }
         ] as any
      };
   });

   console.log(mockOrders)

   return new Promise((res) =>
      setTimeout(
         () =>
            res({
               results: mockOrders,
               next: null,
               previous: null,
               count: 20,
            }),
         1000
      )
   );

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
