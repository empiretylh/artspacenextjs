import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import { queryOptions, useQuery } from "@tanstack/react-query";
import type {
   ColumnFiltersState,
   Artwork,
   SortingState,
   ListApiResponse,
} from "@/types";
import type { AxiosResponse } from "axios";

// ----------------------------------------------------------------------
// 1. GET ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getUploadedArtworks = (
   filters: ColumnFiltersState = [],
   sorts: SortingState = [],
   page = 1,
   limit = 10
): Promise<AxiosResponse<ListApiResponse<Artwork>>> => {
   // Default query params
   const params: Record<string, any> = {
      page,
      page_size: limit, // renamed to match backend
   };

   // Map filters to backend query params
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
            default:
               params[filter.id] = filter.value;
               break;
         }
      }
   });

   // Map sorting state to backend params
   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
      // assuming backend supports "-" prefix for descending
   }

   return api.get(`/artworks/artworks/uploaded/`, { params });
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getUploadedArtworksQueryOptions = (
   options: {
      filters?: ColumnFiltersState;
      sorts?: SortingState;
      page?: number;
      limit?: number;
   } = {}
) => {
   const { filters, sorts, page, limit } = options;
   return queryOptions({
      queryKey: ["artworks/uploaded", filters, sorts, page, limit],
      queryFn: () => getUploadedArtworks(filters, sorts, page, limit),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseArtworksOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getUploadedArtworksQueryOptions>;
};

export const useGetUploadedArtworks = ({
   queryConfig,
   filters,
   sorts,
   page = 1,
   limit = 10,
}: UseArtworksOptions = {}) => {
   return useQuery({
      ...getUploadedArtworksQueryOptions({ filters, sorts, page, limit }),
      ...queryConfig,
   });
};
