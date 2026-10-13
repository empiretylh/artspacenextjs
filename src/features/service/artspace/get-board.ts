import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { Board } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";

export const getBoard = async ({
   boardId,
}: {
   boardId: string;
}): Promise<Board> => {
   const res = await api.get(`/artworks/boards/${boardId}/`);
   return res.data;
};

export const getBoardQueryOptions = (boardId: string) => {
   return queryOptions({
      queryKey: queryKeys.board.detail(boardId),
      queryFn: () => getBoard({ boardId }),
   });
};

type UseBoardOptions = {
   boardId: string;
   queryConfig?: QueryConfig<typeof getBoardQueryOptions>;
   enabled?: boolean;
};

export const useGetBoard = ({
   boardId,
   queryConfig,
   enabled = true,
}: UseBoardOptions) => {
   const { loading } = useAuth();

   return useQuery({
      ...getBoardQueryOptions(boardId),
      ...queryConfig,
      enabled:
         queryConfig?.enabled !== undefined
            ? queryConfig.enabled && !loading && !!boardId
            : enabled && !loading && !!boardId,
   });
};
