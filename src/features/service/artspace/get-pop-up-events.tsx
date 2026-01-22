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
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET EVENTS (API CALL)
// ----------------------------------------------------------------------

export const getPopUpEvents = (
   filters: ColumnFiltersState = [],
   sorts: SortingState = [],
   page?: number,
   limit?: number,
   search = ""
): Promise<AxiosResponse<Event[]>> => {
   return api.get(`/artworks/events/popup`);
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getPopUpEventsQueryOptions = (
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
      queryKey: queryKeys.event.popUp.list({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () => getPopUpEvents(filters, sorts, page, limit, search),
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
   queryConfig?: QueryConfig<typeof getPopUpEventsQueryOptions>;
};

export const useGetPopUpEvents = ({
   queryConfig,
   filters,
   sorts,
   search,
   page,
   limit,
}: UseEventsOptions = {}) => {
   return useQuery({
      ...getPopUpEventsQueryOptions({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      ...queryConfig,
   });
};
