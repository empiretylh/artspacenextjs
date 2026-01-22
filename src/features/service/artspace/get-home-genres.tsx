import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   ColumnFiltersState,
   ListApiResponse,
   Genre,
   SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export const getHomeGenres = (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10
): Promise<AxiosResponse<ListApiResponse<{ id: number; genre: Genre }>>> => {
   return api.get(`/homepage/genres/`, {
      params: {
         // filters,
         // sorts,
         // page,
         limit,
      },
   });
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
      queryKey:
         filters || sorts || page || limit
            ? ["genres", "home", formattedFilters, formattedSorts, page, limit]
            : ["genres", "home"],
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
