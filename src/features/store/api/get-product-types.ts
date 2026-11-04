import { queryOptions, useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ListApiResponse, ProductType } from "@/types";

export const getProductTypes = async (): Promise<ListApiResponse<ProductType>> => {
   const res = await api.get("/store/product-types/", { params: { limit: 100 } });
   return res.data;
};

export const getProductTypesQueryOptions = () => {
   return queryOptions({
      queryKey: queryKeys.store.productTypes.list(),
      queryFn: getProductTypes,
      staleTime: 1000 * 60 * 10,
   });
};

type UseProductTypesOptions = {
   enabled?: boolean;
   queryConfig?: QueryConfig<typeof getProductTypesQueryOptions>;
};

export const useGetProductTypes = ({ enabled = true, queryConfig }: UseProductTypesOptions = {}) => {
   return useQuery({
      ...getProductTypesQueryOptions(),
      enabled,
      ...queryConfig,
   });
};
