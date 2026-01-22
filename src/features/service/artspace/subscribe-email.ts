import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const subscribeEmail = ({
   email,
}: {
   email: string;
}): Promise<Artwork> => {
   return api.post(`/users/subscribe-newsletter/`, { email }); // Use PATCH for updates
};

type UseSubscribeEmailOptions = {
   mutationConfig?: MutationConfig<typeof subscribeEmail>;
};

export const useSubscribeEmail = ({
   mutationConfig,
}: UseSubscribeEmailOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.artwork.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: subscribeEmail,
   });
};
