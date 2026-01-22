import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type {
   ColumnFiltersState,
   ListApiResponse,
   Style,
   SortingState,
} from "@/types";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";

export const getHomeStyles = (
   filters = {},
   sorts = {},
   page = 1,
   limit = 10
): Promise<AxiosResponse<ListApiResponse<{ id: number; style: Style }>>> => {
   return api.get(`/homepage/artwork-styles/`, {
      params: {
         // filters,
         // sorts,
         // page,
         // limit,
      },
   });
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
         filters || sorts || page || limit
            ? ["styles", formattedFilters, formattedSorts, page, limit]
            : ["styles"],
      queryFn: () =>
         getHomeStyles(formattedFilters, formattedSorts, page, limit),
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
