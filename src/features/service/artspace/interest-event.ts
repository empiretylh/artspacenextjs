import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const interestEvent = ({
   eventId,
   interested,
}: {
   eventId: string;
   interested: boolean;
}): Promise<Artwork> => {
   return api.post(`/artworks/events-interest/`, { id: eventId, interested });
};

type UseInterestEventOptions = {
   mutationConfig?: MutationConfig<typeof interestEvent>;
};

export const useInterestEvent = ({
   mutationConfig,
}: UseInterestEventOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: interestEvent,

      ...restConfig,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.event.all,
         });

         onSuccess?.(...args);
      },
   });
};
