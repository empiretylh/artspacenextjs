import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
  ColumnFiltersState,
  Currency,
  SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export const getCurrencies = (
  filters = {},
  sorts = {},
  page = 1,
  limit = 10
): Promise<AxiosResponse<Currency[]>> => {
  return api.get(`/artworks/currencies/`, {
    params: {
      // filters,
      // sorts,
      // page,
      // limit,
    },
  });
};

export const getCurrenciesQueryOptions = (
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
    queryKey:
      filters || sorts || page || limit
        ? ["currencies", formattedFilters, formattedSorts, page, limit]
        : ["currencies"],
    queryFn: () => getCurrencies(formattedFilters, formattedSorts, page, limit),
  });
};

type UseCurrenciesOptions = {
  page?: number;
  limit?: number;
  sorts?: SortingState;
  filters?: ColumnFiltersState;
  queryConfig?: QueryConfig<typeof getCurrenciesQueryOptions>;
};

export const useGetCurrencies = ({
  queryConfig,
  filters,
  sorts,
  page,
  limit,
}: UseCurrenciesOptions = {}) => {
  return useQuery({
    ...getCurrenciesQueryOptions({ filters, sorts, page, limit }),
    ...queryConfig,
  });
};
