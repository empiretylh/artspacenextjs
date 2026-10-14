import {
   queryOptions,
   useMutation,
   useQuery,
   useQueryClient,
} from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { MutationConfig, QueryConfig } from "@/lib/react-query";
import type { ArtworkSaveStatus, SaveArtworkInput } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";

// ----------------------------------------------------------------------
// 1. SAVE ARTWORK SHORTCUT (API CALL)
// ----------------------------------------------------------------------

export const saveArtwork = async ({
   artworkId,
   data,
}: {
   artworkId: string;
   data?: SaveArtworkInput;
}): Promise<any> => {
   const targetId = data?.board_id || data?.collection_id;
   const payload = targetId ? { collection_id: targetId, board_id: targetId } : {};
   const res = await api.post(
      `/artworks/save-for-later/artworks/${artworkId}/save/`,
      payload
   );
   return res.data;
};

type UseSaveArtworkOptions = {
   mutationConfig?: MutationConfig<typeof saveArtwork>;
};

export const useSaveArtwork = ({
   mutationConfig,
}: UseSaveArtworkOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: saveArtwork,
      onSuccess: (...args) => {
         const variables = args[1];
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.saveStatus(variables.artworkId),
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         const targetId = variables.data?.board_id || variables.data?.collection_id;
         if (targetId) {
            queryClient.invalidateQueries({
               queryKey: queryKeys.board.artworks.all(targetId),
            });
         }
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};

// ----------------------------------------------------------------------
// 2. UNSAVE ARTWORK SHORTCUT (API CALL)
// ----------------------------------------------------------------------

export const unsaveArtwork = async ({
   artworkId,
   data,
}: {
   artworkId: string;
   data?: SaveArtworkInput;
}): Promise<any> => {
   const targetId = data?.board_id || data?.collection_id;
   const payload = targetId ? { collection_id: targetId, board_id: targetId } : {};
   const res = await api.delete(
      `/artworks/save-for-later/artworks/${artworkId}/save/`,
      { data: payload }
   );
   return res.data;
};

type UseUnsaveArtworkOptions = {
   mutationConfig?: MutationConfig<typeof unsaveArtwork>;
};

export const useUnsaveArtwork = ({
   mutationConfig,
}: UseUnsaveArtworkOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: unsaveArtwork,
      onSuccess: (...args) => {
         const variables = args[1];
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.saveStatus(variables.artworkId),
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.board.all,
         });
         const targetId = variables.data?.board_id || variables.data?.collection_id;
         if (targetId) {
            queryClient.invalidateQueries({
               queryKey: queryKeys.board.artworks.all(targetId),
            });
         }
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};

// ----------------------------------------------------------------------
// 3. GET ARTWORK SAVE STATUS (API CALL)
// ----------------------------------------------------------------------

export const getArtworkSaveStatus = async ({
   artworkId,
}: {
   artworkId: string;
}): Promise<ArtworkSaveStatus> => {
   const res = await api.get(
      `/artworks/save-for-later/artworks/${artworkId}/save-status/`
   );
   return res.data;
};

export const getArtworkSaveStatusQueryOptions = (artworkId: string) => {
   return queryOptions({
      queryKey: queryKeys.board.saveStatus(artworkId),
      queryFn: () => getArtworkSaveStatus({ artworkId }),
   });
};

type UseArtworkSaveStatusOptions = {
   artworkId: string;
   queryConfig?: QueryConfig<typeof getArtworkSaveStatusQueryOptions>;
   enabled?: boolean;
};

export const useGetArtworkSaveStatus = ({
   artworkId,
   queryConfig,
   enabled = true,
}: UseArtworkSaveStatusOptions) => {
   const { accessToken, loading } = useAuth();

   return useQuery({
      ...getArtworkSaveStatusQueryOptions(artworkId),
      ...queryConfig,
      enabled:
         queryConfig?.enabled !== undefined
            ? queryConfig.enabled && !loading && !!accessToken && !!artworkId
            : enabled && !loading && !!accessToken && !!artworkId,
   });
};
