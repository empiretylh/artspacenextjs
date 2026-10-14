import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type {
   Board,
   CreateBoardInput,
   UpdateBoardInput,
} from "@/types";
import { queryKeys } from "@/config/query-keys";

// ----------------------------------------------------------------------
// 1. CREATE BOARD
// ----------------------------------------------------------------------

export const createBoard = async (data: CreateBoardInput): Promise<Board> => {
   const res = await api.post("/artworks/boards/", {
      name: data.name.trim(),
      visibility: data.visibility || "PRIVATE",
   });
   return res.data;
};

type UseCreateBoardOptions = {
   mutationConfig?: MutationConfig<typeof createBoard>;
};

export const useCreateBoard = ({
   mutationConfig,
}: UseCreateBoardOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: createBoard,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};

// ----------------------------------------------------------------------
// 2. UPDATE BOARD
// ----------------------------------------------------------------------

export const updateBoard = async ({
   boardId,
   data,
}: {
   boardId: string;
   data: UpdateBoardInput;
}): Promise<Board> => {
   const payload: Record<string, any> = {};
   if (data.name !== undefined) payload.name = data.name.trim();
   if (data.visibility !== undefined) payload.visibility = data.visibility;

   const res = await api.patch(
      `/artworks/boards/${boardId}/`,
      payload
   );
   return res.data;
};

type UseUpdateBoardOptions = {
   mutationConfig?: MutationConfig<typeof updateBoard>;
};

export const useUpdateBoard = ({
   mutationConfig,
}: UseUpdateBoardOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: updateBoard,
      onSuccess: (...args) => {
         const variables = args[1];
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.detail(variables.boardId),
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};

// ----------------------------------------------------------------------
// 3. DELETE BOARD
// ----------------------------------------------------------------------

export const deleteBoard = async ({
   boardId,
}: {
   boardId: string;
}): Promise<void> => {
   await api.delete(`/artworks/boards/${boardId}/`);
};

type UseDeleteBoardOptions = {
   mutationConfig?: MutationConfig<typeof deleteBoard>;
};

export const useDeleteBoard = ({
   mutationConfig,
}: UseDeleteBoardOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: deleteBoard,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};

// ----------------------------------------------------------------------
// 4. ADD ARTWORK TO BOARD
// ----------------------------------------------------------------------

export const addArtworkToBoard = async ({
   boardId,
   artworkId,
}: {
   boardId: string;
   artworkId: string;
}): Promise<any> => {
   const res = await api.post(
      `/artworks/boards/${boardId}/artworks/`,
      { artwork_id: artworkId }
   );
   return res.data;
};

type UseAddArtworkToBoardOptions = {
   mutationConfig?: MutationConfig<typeof addArtworkToBoard>;
};

export const useAddArtworkToBoard = ({
   mutationConfig,
}: UseAddArtworkToBoardOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: addArtworkToBoard,
      onSuccess: (...args) => {
         const variables = args[1];
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.artworks.all(variables.boardId),
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.saveStatus(variables.artworkId),
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};

// ----------------------------------------------------------------------
// 5. REMOVE ARTWORK FROM BOARD
// ----------------------------------------------------------------------

export const removeArtworkFromBoard = async ({
   boardId,
   artworkId,
}: {
   boardId: string;
   artworkId: string;
}): Promise<void> => {
   await api.delete(
      `/artworks/boards/${boardId}/artworks/${artworkId}/`
   );
};

type UseRemoveArtworkFromBoardOptions = {
   mutationConfig?: MutationConfig<typeof removeArtworkFromBoard>;
};

export const useRemoveArtworkFromBoard = ({
   mutationConfig,
}: UseRemoveArtworkFromBoardOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: removeArtworkFromBoard,
      onSuccess: (...args) => {
         const variables = args[1];
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.artworks.all(variables.boardId),
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.saveStatus(variables.artworkId),
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
