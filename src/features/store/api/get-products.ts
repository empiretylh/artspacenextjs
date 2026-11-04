import { queryOptions, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ListApiResponse, Product } from "@/types";

export type ProductFilters = {
   artwork?: string;
   artist?: string | number;
   product_type?: string;
   /** Only honoured for staff; the public list is always published-only. */
   is_published?: boolean;
   page?: number;
   limit?: number;
};

/**
 * Stable cache key for the exact-match store filterset. Sorted so that two
 * callers passing the same filters in different orders share one entry.
 */
const productFilterKey = (filters?: ProductFilters) => {
   if (!filters) return {};
   return Object.fromEntries(
      Object.keys(filters)
         .sort()
         .map((key) => [key, filters[key as keyof ProductFilters]]),
   );
};

export const getProducts = async ({
   filters,
}: {
   filters?: ProductFilters;
}): Promise<ListApiResponse<Product>> => {
   const res = await api.get("/store/products/", { params: filters });
   return res.data;
};

export const getProductsQueryOptions = (filters?: ProductFilters) => {
   return queryOptions({
      queryKey: [...queryKeys.store.products.list(), productFilterKey(filters)],
      queryFn: () => getProducts({ filters }),
   });
};

type UseProductsOptions = {
   filters?: ProductFilters;
   enabled?: boolean;
   queryConfig?: QueryConfig<typeof getProductsQueryOptions>;
};

export const useGetProducts = ({
   filters,
   enabled = true,
   queryConfig,
}: UseProductsOptions = {}) => {
   return useQuery({
      ...getProductsQueryOptions(filters),
      enabled,
      ...queryConfig,
   });
};

export const getProduct = async ({ productId }: { productId: string }): Promise<Product> => {
   const res = await api.get(`/store/products/${productId}/`);
   return res.data;
};

export const getProductQueryOptions = (productId: string) => {
   return queryOptions({
      queryKey: queryKeys.store.products.detail(productId),
      queryFn: () => getProduct({ productId }),
   });
};

type UseProductOptions = {
   productId: string;
   enabled?: boolean;
   queryConfig?: QueryConfig<typeof getProductQueryOptions>;
};

export const useGetProduct = ({
   productId,
   enabled = true,
   queryConfig,
}: UseProductOptions) => {
   return useQuery({
      ...getProductQueryOptions(productId),
      enabled: enabled && Boolean(productId),
      ...queryConfig,
   });
};
