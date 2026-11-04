import { useMutation } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";

export type MasStoreEligibility = {
   artwork: string;
   mas_store_eligible: boolean;
};

/**
 * Grant or revoke the artist's merch licence on one artwork.
 *
 * This is the only writable path for the flag: the generic artwork PUT and PATCH
 * pins mas_store_eligible read-only, because ArtworkCreateSerializer is written
 * as exclude=('styles',) and would otherwise accept it from any owner.
 */
export const setMasStoreEligibility = async ({
   artworkId,
   eligible,
}: {
   artworkId: string;
   eligible: boolean;
}): Promise<MasStoreEligibility> => {
   const res = await api.post(
      `/artworks/artworks/${artworkId}/mas-store-eligibility/`,
      { mas_store_eligible: eligible },
   );
   return res.data;
};

type UseSetMasStoreEligibilityOptions = {
   mutationConfig?: MutationConfig<typeof setMasStoreEligibility>;
};

export const useSetMasStoreEligibility = ({
   mutationConfig,
}: UseSetMasStoreEligibilityOptions = {}) => {
   return useMutation({
      mutationFn: setMasStoreEligibility,
      ...mutationConfig,
   });
};
