import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   ColumnFiltersState,
   Artwork,
   SortingState,
   ListApiResponse,
} from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getLikedArtworksByUserId = async ({
   userId,
   filters,
   sorts,
   page,
   limit,
   search
}: { filters?: ColumnFiltersState, sorts?: SortingState, page?: number, limit?: number, search?: string, userId: string }): Promise<ListApiResponse<Artwork>> => {
   // Default query params
   const params: Record<string, any> = {
      page,
      page_size: limit, // renamed to match backend
   };

   params.search = search;

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
            case "price_range": {
               const [min, max] = filter.value
                  .toString()
                  .split("-")
                  .map(Number);

               // Always initialize as array if not exist
               // if (!params.price_min) params.price_min = [];
               // if (!params.price_max) params.price_max = [];

               // Push the new values
               params.price_min = min;
               params.price_max = max;

               break;
            }
            default:
               // Aggregate multiple values into an array
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

   // Map sorting state to backend params
   if (sorts && sorts?.length > 0) {
      params.ordering = sorts?.[0].desc ? `-${sorts?.[0].id}` : sorts?.[0].id;
   }

   const res = await api.get(`/artworks/liked/user/${userId}/`, { params });

   return res.data;
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getLikedArtworksByUserIdQueryOptions = (options: {
   userId: string;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}) => {
   const { userId, filters, sorts, page, limit, search } = options;
   return queryOptions({
      queryKey: [
         `/artworks/uploaded/user/${userId}/`,
         filters,
         sorts,
         page,
         limit,
         search,
      ],
      queryFn: () =>
         getLikedArtworksByUserId({ userId, filters, sorts, page, limit, search }),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseArtworksOptions = {
   userId: string;
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getLikedArtworksByUserIdQueryOptions>;
};

export const useGetLikedArtworksByUserId = ({
   userId,
   queryConfig,
   filters,
   sorts,
   search,
   page = 1,
   limit = 10,
}: UseArtworksOptions) => {
   return useQuery({
      ...getLikedArtworksByUserIdQueryOptions({
         userId,
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      ...queryConfig,
   });
};

export const getLikedArtworksByUserIdQueryInfiniteOptions = (options: {
   userId: string;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}) => {
   const { userId, filters, sorts, page, limit, search } = options;
   return queryOptions({
      queryKey: queryKeys.artwork.liked.byUser(userId, {
         filters,
         sorts,
         search,
         page,
         limit,
      }),
      queryFn: () =>
         getLikedArtworksByUserId({ userId, filters, sorts, page, limit, search }),
   });
};

export const useGetLikedArtworksByUserIdInfinite = ({
   userId,
   filters,
   sorts,
   search,
   limit = 10,
}: UseArtworksOptions) => {
   return useInfiniteQuery({
      queryKey: queryKeys.artwork.liked.byUser(userId, {
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getLikedArtworksByUserId(
            {
               userId,
               filters,
               sorts,
               page: pageParam,
               limit,
               search
            }
         ),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      // Add initialPageParam here
      initialPageParam: 1,
   });
};
