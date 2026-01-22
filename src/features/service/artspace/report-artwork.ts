import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";

export const reportArtwork = ({
   artworkId,
   report,
}: {
   artworkId: string;
   report: string;
}): Promise<Artwork> => {
   return api.post(`/reports/artwork/`, { artwork: artworkId, reason: report });
};

type UseReportArtworkOptions = {
   mutationConfig?: MutationConfig<typeof reportArtwork>;
};

export const useReportArtwork = ({
   mutationConfig,
}: UseReportArtworkOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: reportArtwork,

      ...restConfig,
      onSuccess: (...args) => {
         //  queryClient.invalidateQueries({
         //     queryKey: queryKeys.artwork.all,
         //  });

         onSuccess?.(...args);
      },
   });
};
