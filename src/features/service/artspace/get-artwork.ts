import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, Artwork } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";

export const getArtwork = async ({
   artworkId,
}: {
   artworkId: string;
}): Promise<ApiResponse<Artwork>> => {
   const res = await api.get(`/artworks/artworks/${artworkId}`);

   return res.data;
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
   const { accessToken } = useAuth.getState();

   return useQuery({
      ...getArtworkQueryOptions(artworkId),
      ...queryConfig,
      enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
   });
};
