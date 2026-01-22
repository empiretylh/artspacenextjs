import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ColumnFiltersState, Category, SortingState } from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export const getCategories = (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10
): Promise<AxiosResponse<Category[]>> => {
   return api.get(`/artworks/categories/`, {
      params: {
         // filters,
         // sorts,
         // page,
         // limit,
      },
   });
};

export const getCategoriesQueryOptions = (
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
            ? ["categories", formattedFilters, formattedSorts, page, limit]
            : ["categories"],
      queryFn: () =>
         getCategories(formattedFilters, formattedSorts, page, limit),
   });
};

type UseCategoriesOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getCategoriesQueryOptions>;
};

export const useGetCategories = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseCategoriesOptions = {}) => {
   return useQuery({
      ...getCategoriesQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
