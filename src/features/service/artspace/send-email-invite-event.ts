import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const sendEmailInviteEvent = ({
   artworkId,
}: {
   artworkId: string;
}): Promise<Artwork> => {
   return api.delete(`/artworks/artworks/${artworkId}/`); // Use PATCH for updates
};

type UseSendEmailInviteEventOptions = {
   mutationConfig?: MutationConfig<typeof sendEmailInviteEvent>;
};

export const useSendEmailInviteEvent = ({
   mutationConfig,
}: UseSendEmailInviteEventOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.artwork.list(),
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.artwork.infinite(),
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: sendEmailInviteEvent,
   });
};
