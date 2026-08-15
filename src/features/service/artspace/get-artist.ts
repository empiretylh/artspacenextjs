import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";

export const getCachedArtist = cache((id: string) => getArtist({ artistId: id }))

export const getArtist = async ({
   artistId,
}: {
   artistId: string;
}): Promise<ApiResponse<User>> => {
   const res = await api.get(`/users/profile/public/${artistId}/`);

   return res.data;
};

export const getArtistQueryOptions = (artistId: string) => {
   return queryOptions({
      queryKey: queryKeys.artist.detail(artistId),
      queryFn: () => getArtist({ artistId }),
   });
};

type UseArtistOptions = {
   artistId: string;
   queryConfig?: QueryConfig<typeof getArtistQueryOptions>;
};

export const useGetArtist = ({ artistId, queryConfig }: UseArtistOptions) => {
   const { accessToken } = useAuth.getState();

   return useQuery({
      ...getArtistQueryOptions(artistId),
      ...queryConfig,
      enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
   });
};
