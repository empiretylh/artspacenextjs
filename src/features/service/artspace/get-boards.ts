import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import {
   queryOptions,
   useInfiniteQuery,
   useQuery,
} from "@tanstack/react-query";
import type {
   Board,
   ColumnFiltersState,
   SortingState,
   ListApiResponse,
} from "@/types";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";

export type BoardsResponse = ListApiResponse<Board> | Board[];

// Helper to reliably extract array of boards regardless of pagination format
export const extractBoards = (data?: BoardsResponse): Board[] => {
   if (!data) return [];
   if (Array.isArray(data)) return data;
   return data.results || [];
};

// ----------------------------------------------------------------------
// 1. GET BOARDS (API CALL)
// ----------------------------------------------------------------------

export const getBoards = async (options: {
   filters?: ColumnFiltersState;
   sorts?: SortingState;
   page?: number;
   limit?: number;
   search?: string;
} = {}): Promise<BoardsResponse> => {
   const { page, limit, search } = options;
   const params: Record<string, any> = {
      page,
      page_size: limit,
   };

   if (search) {
      params.search = search;
   }

   const res = await api.get("/artworks/boards/", {
      params,
   });

   return res.data;
};

// ----------------------------------------------------------------------
// 2. REACT QUERY OPTIONS
// ----------------------------------------------------------------------

export const getBoardsQueryOptions = (
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
      queryKey: queryKeys.board.list({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      queryFn: () => getBoards({ filters, sorts, page, limit, search }),
   });
};

// ----------------------------------------------------------------------
// 3. CUSTOM HOOKS
// ----------------------------------------------------------------------

type UseBoardsOptions = {
   page?: number;
   limit?: number;
   sorts?: SortingState;
   search?: string;
   filters?: ColumnFiltersState;
   queryConfig?: QueryConfig<typeof getBoardsQueryOptions>;
   enabled?: boolean;
};

export const useGetBoards = ({
   queryConfig,
   filters,
   sorts,
   search,
   page,
   limit,
   enabled = true,
}: UseBoardsOptions = {}) => {
   const { accessToken, loading } = useAuth();

   return useQuery({
      ...getBoardsQueryOptions({
         filters,
         sorts,
         page,
         limit,
         search,
      }),
      enabled: enabled && !loading && !!accessToken,
      ...queryConfig,
   });
};

// ----------------------------------------------------------------------
// 4. INFINITE QUERY
// ----------------------------------------------------------------------

export const useGetBoardsInfinite = ({
   filters,
   sorts,
   search,
   limit = 20,
   enabled = true,
}: UseBoardsOptions = {}) => {
   const { accessToken, loading } = useAuth();

   return useInfiniteQuery({
      queryKey: queryKeys.board.infinite({
         filters,
         sorts,
         search,
         limit,
      }),
      queryFn: ({ pageParam = 1 }) =>
         getBoards({
            filters,
            sorts,
            page: pageParam,
            limit,
            search,
         }),
      getNextPageParam: (lastPage: BoardsResponse, pages) => {
         if (Array.isArray(lastPage)) {
            return undefined;
         }
         const total = lastPage.count;
         const currentPage = pages.length;
         return total > currentPage * limit ? currentPage + 1 : undefined;
      },
      initialPageParam: 1,
      enabled: enabled && !loading && !!accessToken,
   });
};

// ----------------------------------------------------------------------
// 5. GET USER PUBLIC BOARDS (API CALL & HOOK)
// ----------------------------------------------------------------------

export const getUserBoards = async (userId: string): Promise<Board[]> => {
   const res = await api.get(`/artworks/boards/user/${userId}/`);
   return Array.isArray(res.data) ? res.data : res.data?.results || [];
};

export const getUserBoardsQueryOptions = (userId: string) => {
   return queryOptions({
      queryKey: queryKeys.board.user(userId),
      queryFn: () => getUserBoards(userId),
   });
};

export const useGetUserBoards = ({
   userId,
   queryConfig,
   enabled = true,
}: {
   userId: string;
   queryConfig?: QueryConfig<typeof getUserBoardsQueryOptions>;
   enabled?: boolean;
}) => {
   return useQuery({
      ...getUserBoardsQueryOptions(userId),
      enabled: enabled && !!userId,
      ...queryConfig,
   });
};
