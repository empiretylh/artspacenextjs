import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ColumnFiltersState, Banner, SortingState } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export const getBanners = async (
  filters = {},
  sorts = {},
  page = 1,
  limit = 10
): Promise<Banner[]> => {
  const res = await api.get(`/homepage/banners/`, {
    params: {
      // filters,
      // sorts,
      // page,
      // limit,
    },
  });

  return res.data;
};

export const getBannersQueryOptions = (
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
        ? ["banners", formattedFilters, formattedSorts, page, limit]
        : ["banners"],
    queryFn: () =>
      getBanners(formattedFilters, formattedSorts, page, limit),
  });
};

type UseBannersOptions = {
  page?: number;
  limit?: number;
  sorts?: SortingState;
  filters?: ColumnFiltersState;
  queryConfig?: QueryConfig<typeof getBannersQueryOptions>;
};

export const useGetBanners = ({
  queryConfig,
  filters,
  sorts,
  page,
  limit,
}: UseBannersOptions = {}) => {
  return useQuery({
    ...getBannersQueryOptions({ filters, sorts, page, limit }),
    ...queryConfig,
  });
};
