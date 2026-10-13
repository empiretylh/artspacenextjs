import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   Artwork,
   ColumnFiltersState,
   SortingState,
   ListApiResponse,
} from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. GET BOARD ARTWORKS (API CALL)
// ----------------------------------------------------------------------

export const getBoardArtworks = async ({
   boardId,
   filters,
   sorts,
   page,
   limit,
   search,
}: {
   boardId: string;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}): Promise<ListApiResponse<Artwork>> => {
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   if (search) {
      params.search = search;
   }

   // Map filters if provided
   filters?.forEach((filter) => {
      if (
         filter.value !== undefined &&
         filter.value !== null &&
         filter.value !== ""
      ) {
         params[filter.id] = filter.value;
      }
   });

   if (sorts && sorts.length > 0) {
      params.ordering = sorts[0].desc ? `-${sorts[0].id}` : sorts[0].id;
   }

   const res = await api.get(
      `/artworks/boards/${boardId}/artworks/`,
      { params }
   );

   return res.data;
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getBoardArtworksQueryOptions = (options: {
   boardId: string;
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
}) => {
   const { boardId, filters, sorts, page, limit, search } = options;

   return queryOptions({
      queryKey: queryKeys.board.artworks.list(boardId, {
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () =>
         getBoardArtworks({ boardId, filters, sorts, page, limit, search }),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOKS
// ----------------------------------------------------------------------

type UseBoardArtworksOptions = {
   boardId: string;
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getBoardArtworksQueryOptions>;
   enabled?: boolean;
};

export const useGetBoardArtworks = ({
   boardId,
   queryConfig,
   filters,
   sorts,
   search,
   page = 1,
   limit = 12,
   enabled = true,
}: UseBoardArtworksOptions) => {
   return useQuery({
      ...getBoardArtworksQueryOptions({
         boardId,
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      enabled: enabled && !!boardId,
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 4. INFINITE QUERY
// ----------------------------------------------------------------------

export const useGetBoardArtworksInfinite = ({
   boardId,
   filters,
   sorts,
   search,
   limit = 12,
   enabled = true,
}: UseBoardArtworksOptions) => {
   return useInfiniteQuery({
      queryKey: queryKeys.board.artworks.infinite(boardId, {
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getBoardArtworks({
            boardId,
            filters,
            sorts,
            page: pageParam,
            limit,
            search,
         }),
      getNextPageParam: (lastPage, pages) => {
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: enabled && !!boardId,
   });
};
