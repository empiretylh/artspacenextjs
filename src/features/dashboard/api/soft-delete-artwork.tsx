import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { getUploadedArtworksQueryOptions } from "./get-uploaded-artworks";

export const softDeleteArtwork = ({
   artworkId,
}: {
   artworkId: string;
}): Promise<Artwork> => {
   return api.delete(`/artworks/artworks/${artworkId}/`); // Use PATCH for updates
};

type UseSoftDeleteArtworkOptions = {
   mutationConfig?: MutationConfig<typeof softDeleteArtwork>;
};

export const useSoftDeleteArtwork = ({
   mutationConfig,
}: UseSoftDeleteArtworkOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: [getUploadedArtworksQueryOptions().queryKey?.[0]],
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: softDeleteArtwork,
   });
};
