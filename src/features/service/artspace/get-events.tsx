import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   ColumnFiltersState,
   Event,
   SortingState,
   ListApiResponse,
} from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET EVENTS (API CALL)
// ----------------------------------------------------------------------

export const getEvents = async ({
   filters = [],
   sorts = [],
   page,
   limit,
   search = ""
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string }): Promise<ListApiResponse<Event>> => {
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   params.search = search;

   filters?.forEach((filter) => {
      if (
         filter.value !== undefined &&
         filter.value !== null &&
         filter.value !== ""
      ) {
         switch (filter.id) {
            case "price_min":
            case "price_max":
            case "year":
            case "page":
            case "page_size":
               params[filter.id] = Number(filter.value);
               break;

            case "price_range": {
               const [min, max] = filter.value
                  .toString()
                  .split("-")
                  .map(Number);

               params.price_min = min;
               params.price_max = max;
               break;
            }

            default:
               if (params[filter.id]) {
                  if (Array.isArray(params[filter.id])) {
                     params[filter.id].push(filter.value);
                  } else {
                     params[filter.id] = [params[filter.id], filter.value];
                  }
               } else {
                  params[filter.id] = filter.value;
               }
               break;
         }
      }
   });

   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   const res = await api.get(`/artworks/events/`, { params });

   return res.data;
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getEventsQueryOptions = (
   options: {
      filters?: ColumnFiltersState;
      sorts?: SortingState;
      page?: number;
      limit?: number;
      search?: string;
   } = {}
) => {
   const { filters, sorts, page, limit, search } = options;

   return queryOptions({
      queryKey: queryKeys.event.list({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () => getEvents({ filters, sorts, page, limit, search }),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseEventsOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getEventsQueryOptions>;
};

export const useGetEvents = ({
   queryConfig,
   filters,
   sorts,
   search,
   page,
   limit,
}: UseEventsOptions = {}) => {
   return useQuery({
      ...getEventsQueryOptions({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 4. INFINITE QUERY
// ----------------------------------------------------------------------

export const useGetEventsInfinite = ({
   filters,
   sorts,
   search,
   limit = 10,
}: UseEventsOptions = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.event.infinite({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getEvents({ filters, sorts, page: pageParam, limit, search }),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
   });
};
