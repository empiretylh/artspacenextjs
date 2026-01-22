import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const likeArtwork = ({
   artworkId,
   like,
}: {
   artworkId: string;
   like: boolean;
}): Promise<Artwork> => {
   return api.post(`/artworks/like/`, { id: artworkId, liked: like });
};

type UseLikeArtworkOptions = {
   mutationConfig?: MutationConfig<typeof likeArtwork>;
};

export const useLikeArtwork = ({
   mutationConfig,
}: UseLikeArtworkOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: likeArtwork,

      // Optimistic update (kept commented exactly as provided)
      // onMutate: async (
      //    { artworkId },
      //    context
      // ): Promise<
      //    | {
      //         previousAll: any;
      //         previousInfinite: any;
      //      }
      //    | undefined
      // > => {
      //    await context.client.cancelQueries({
      //       queryKey: queryKeys.artwork.list(),
      //    });
      //    await context.client.cancelQueries({
      //       queryKey: queryKeys.artwork.infinite(),
      //    });

      //    const previousAll = context.client.getQueryData<Artwork[]>(
      //       queryKeys.artwork.list()
      //    );
      //    const previousInfinite = context.client.getQueryData<any>(
      //       queryKeys.artwork.infinite()
      //    );

      //    if (previousAll) {
      //       context.client.setQueryData<Artwork[]>(
      //          queryKeys.artwork.list(),
      //          (old) =>
      //             old?.map((art) =>
      //                String(art.id) === artworkId
      //                   ? { ...art, is_liked: !art.is_liked }
      //                   : art
      //             )
      //       );
      //    }

      //    if (previousInfinite) {
      //       context.client.setQueryData(
      //          queryKeys.artwork.infinite(),
      //          (old: any) => {
      //             if (!old?.pages) return old;
      //             return {
      //                ...old,
      //                pages: old.pages.map((page: Artwork[]) =>
      //                   page.map((art: Artwork) =>
      //                      String(art.id) === artworkId
      //                         ? { ...art, is_liked: !art.is_liked }
      //                         : art
      //                   )
      //                ),
      //             };
      //          }
      //       );
      //    }

      //    return { previousAll, previousInfinite };
      // },

      // onError: (err, variables, onMutateResult: any) => {
      //    if (onMutateResult?.previousAll) {
      //       queryClient.setQueryData(
      //          queryKeys.artwork.list(),
      //          onMutateResult.previousAll
      //       );
      //    }
      //    if (onMutateResult?.previousInfinite) {
      //       queryClient.setQueryData(
      //          queryKeys.artwork.infinite(),
      //          onMutateResult.previousInfinite
      //       );
      //    }
      // },

      ...restConfig,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.artwork.all,
         });

         onSuccess?.(...args);
      },
   });
};
