import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Event } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

export const eventSoftDelete = ({
   eventId,
}: {
   eventId: string;
}): Promise<Event> => {
   return api.delete(`/artworks/events/${eventId}/`); // Use PATCH for updates
};

type UseEventSoftDeleteOptions = {
   mutationConfig?: MutationConfig<typeof eventSoftDelete>;
};

export const useEventSoftDelete = ({
   mutationConfig,
}: UseEventSoftDeleteOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.event.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: eventSoftDelete,
   });
};
