import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Currency } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";

export interface PriceFilterRange {
   value: string;
   label: string;
   min: number | null;
   max: number | null;
   min_inclusive: boolean;
   max_inclusive: boolean;
   artwork_count: number;
}

export interface PriceFilterSlider {
   min: number;
   max: number;
   step: number;
}

export interface PriceFilterResponse {
   currency: Currency;
   default_currency: string;
   price_ranges: PriceFilterRange[];
   slider: PriceFilterSlider;
   artwork_count: number;
   generated_at: string;
   custom_range: {
      min_param: string;
      max_param: string;
   };
}

export const getPriceFilterOptions = async (
   currency?: string
): Promise<PriceFilterResponse> => {
   const res = await api.get(`/artworks/artworks/filter-options/`, {
      params: currency ? { currency } : {},
   });
   return res.data;
};

export const getPriceFilterOptionsQueryOptions = (currency?: string) => {
   return queryOptions({
      queryKey: queryKeys.artwork.priceFilterOptions(currency || "default"),
      queryFn: () => getPriceFilterOptions(currency),
   });
};

type UsePriceFilterOptionsOptions = {
   currency?: string;
   queryConfig?: QueryConfig<typeof getPriceFilterOptionsQueryOptions>;
};

export const useGetPriceFilterOptions = ({
   currency,
   queryConfig,
}: UsePriceFilterOptionsOptions) => {
   return useQuery({
      ...getPriceFilterOptionsQueryOptions(currency),
      ...queryConfig,
   });
};
