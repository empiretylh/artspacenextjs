import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   ColumnFiltersState,
   ListApiResponse,
   Genre,
   SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getHomeGenres = async (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10
): Promise<ListApiResponse<{ id: number; genre: Genre }>> => {
   const response = await api.get(`/homepage/genres/`, {
      params: {
         // filters,
         // sorts,
         // page,
         limit,
      },
   });

   return response.data;
};

export const getHomeGenresQueryOptions = (
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
      queryKey: queryKeys.genre.list({
         filters,
         sorts,
         page,
         limit,
      }),
      queryFn: () =>
         getHomeGenres(formattedFilters, formattedSorts, page, limit),
   });
};

type UseGenresOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getHomeGenresQueryOptions>;
};

export const useGetHomeGenres = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseGenresOptions = {}) => {
   return useQuery({
      ...getHomeGenresQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
