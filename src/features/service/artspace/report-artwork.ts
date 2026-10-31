import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Report } from "@/types";
import type { MutationConfig } from "@/lib/react-query";

export const reportArtwork = async ({
   artworkId,
   report,
}: {
   artworkId: string;
   report: string;
}): Promise<Report> => {
   const res = await api.post(`/reports/artwork/`, { artwork: artworkId, reason: report });
   return res.data;
};

type UseReportArtworkOptions = {
   mutationConfig?: MutationConfig<typeof reportArtwork>;
};

export const useReportArtwork = ({
   mutationConfig,
}: UseReportArtworkOptions = {}) => {
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: reportArtwork,

      ...restConfig,
      onSuccess: (...args) => {
         onSuccess?.(...args);
      },
   });
};
