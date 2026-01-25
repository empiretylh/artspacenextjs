import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   Category,
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getHomeCategories = async (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10
): Promise<ListApiResponse<{ id: number; category: Category }>> => {
   const response = await api.get(`/homepage/categories/`, {
      params: {
         // filters,
         // sorts,
         // page,
         // limit,
      },
   });

   return response.data
};

export const getHomeCategoriesQueryOptions = (
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
            ? [
               "categories",
               "home",
               formattedFilters,
               formattedSorts,
               page,
               limit,
            ]
            : ["categories", "home"],
      queryFn: () =>
         getHomeCategories(formattedFilters, formattedSorts, page, limit),
   });
};

type UseCategoriesOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getHomeCategoriesQueryOptions>;
};

export const useGetHomeCategories = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseCategoriesOptions = {}) => {
   return useQuery({
      ...getHomeCategoriesQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
