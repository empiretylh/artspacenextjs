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
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getUploadedArtworks = (
   filters: ColumnFiltersState = [],
   sorts: SortingState = [],
   page = 1,
   limit = 10,
   search = ""
): Promise<AxiosResponse<ListApiResponse<Artwork>>> => {
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
   if (sorts?.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
      // assuming backend supports "-" prefix for descending
   }

   // return Promise.resolve({
   //    status: 200, // or the actual status code
   //    statusText: "OK", // or the actual status text
   //    headers: {}, // or the actual headers
   //    config: {}, // or the actual config
   //    data: {
   //       count: 0,
   //       next: null,
   //       previous: null,
   //       results: [
   //          {
   //             id: 1,
   //             title: "Artwork 1",
   //             artist: "Artist 1",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 600,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/600/400.jpg",
   //          },
   //          {
   //             id: 2,
   //             title: "Artwork 2",
   //             artist: "Artist 2",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 400,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/400/400.jpg",
   //          },
   //          {
   //             id: 3,
   //             title: "Artwork 3",
   //             artist: "Artist 3",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 300,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/300/400.jpg",
   //          },
   //          {
   //             id: 4,
   //             title: "Artwork 4",
   //             artist: "Artist 4",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 100,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/100/400.jpg",
   //          },
   //          {
   //             id: 5,
   //             title: "Artwork 5",
   //             artist: "Artist 5",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 600,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/600/400.jpg",
   //          },
   //          {
   //             id: 6,
   //             title: "Artwork 6",
   //             artist: "Artist 6",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 500,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/500/400.jpg",
   //          },
   //          {
   //             id: 7,
   //             title: "Artwork 7",
   //             artist: "Artist 7",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 500,
   //             width: 400,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/400/500.jpg",
   //          },
   //          {
   //             id: 8,
   //             title: "Artwork 8",
   //             artist: "Artist 8",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 300,
   //             width: 300,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/300/300.jpg",
   //          },
   //          {
   //             id: 9,
   //             title: "Artwork 9",
   //             artist: "Artist 9",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 200,
   //             width: 200,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/200/200.jpg",
   //          },
   //          {
   //             id: 10,
   //             title: "Artwork 10",
   //             artist: "Artist 10",
   //             dimensions: "18x27 inches",
   //             category_name: "Painting",
   //             height: 400,
   //             width: 100,
   //             year: 2022,
   //             price: 100,
   //             image: "https://picsum.photos/id/655/100/400.jpg",
   //          },
   //       ],
   //    },
   // });

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
      search?: string;
   } = {}
) => {
   const { filters, sorts, page, limit, search } = options;
   return queryOptions({
      queryKey: queryKeys.artwork.list({
         filters,
         sorts,
         search,
         page,
         limit,
      }),
      queryFn: () => getUploadedArtworks(filters, sorts, page, limit, search),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOK
// ----------------------------------------------------------------------

type UseArtworksOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getUploadedArtworksQueryOptions>;
};

export const useGetUploadedArtworks = ({
   queryConfig,
   filters,
   sorts,
   search,
   page = 1,
   limit = 10,
}: UseArtworksOptions = {}) => {
   return useQuery({
      ...getUploadedArtworksQueryOptions({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      ...queryConfig,
   });
};

export const getUploadedArtworksQueryInfiniteOptions = (
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
      queryKey: queryKeys.artwork.list({
         filters,
         sorts,
         search,
         page,
         limit,
      }),
      queryFn: () => getUploadedArtworks(filters, sorts, page, limit, search),
   });
};

export const useGetUploadedArtworksInfinite = ({
   filters,
   sorts,
   search,
   limit = 10,
}: UseArtworksOptions = {}) => {
   return useInfiniteQuery({
      queryKey: queryKeys.artwork.byUser.me({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getUploadedArtworks(filters, sorts, pageParam, limit, search),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.data.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      // Add initialPageParam here
      initialPageParam: 1,
   });
};
