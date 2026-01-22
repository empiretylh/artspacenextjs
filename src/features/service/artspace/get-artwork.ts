import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, Artwork } from "@/types";
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

export const getArtwork = ({
   artworkId,
}: {
   artworkId: string;
}): Promise<AxiosResponse<ApiResponse<Artwork>>> => {
   return api.get(`/artworks/artworks/${artworkId}`);
};

export const getArtworkQueryOptions = (artworkId: string) => {
   return queryOptions({
      queryKey: queryKeys.artwork.detail(artworkId),
      queryFn: () => getArtwork({ artworkId }),
   });
};

type UseArtworkOptions = {
   artworkId: string;
   queryConfig?: QueryConfig<typeof getArtworkQueryOptions>;
};

export const useGetArtwork = ({
   artworkId,
   queryConfig,
}: UseArtworkOptions) => {
   return useQuery({
      ...getArtworkQueryOptions(artworkId),
      ...queryConfig,
   });
};
