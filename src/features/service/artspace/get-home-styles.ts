import { queryKeys } from "@/config/query-keys";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   Style,
   ColumnFiltersState,
   ListApiResponse,
   SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";

export const getHomeStyles = async (
   { filters = {},
      sorts = {},
      page = 1,
      limit = 10 }
): Promise<ListApiResponse<{ id: number; style: Style }>> => {
   const response = await api.get(`/homepage/styles/`, {
      params: {
         // filters,
         // sorts,
         // page,
         // limit,
      },
   });

   return response.data
};

export const getHomeStylesQueryOptions = (
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
         queryKeys.style.home.list({
            filters,
            sorts,
            page,
            limit,
         }),
      queryFn: () =>
         getHomeStyles({ filters: formattedFilters, sorts: formattedSorts, page, limit }),
   });
};

type UseStylesOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getHomeStylesQueryOptions>;
};

export const useGetHomeStyles = ({
   queryConfig,
   filters,
   sorts,
   page,
   limit,
}: UseStylesOptions = {}) => {
   return useQuery({
      ...getHomeStylesQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
