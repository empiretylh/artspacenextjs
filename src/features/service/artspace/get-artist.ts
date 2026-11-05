import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";

export const getCachedArtist = cache((id: string) => getArtist({ artistId: id }));

export const getArtist = async ({
   artistId,
}: {
   artistId: string;
}): Promise<ApiResponse<User>> => {
   if (!artistId || artistId.trim() === "") {
      throw new Error("artistId is required to get artist");
   }
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
   const isConfigEnabled = queryConfig?.enabled !== undefined ? Boolean(queryConfig.enabled) : true;
   const hasAuth = accessToken === null || !!accessToken;

   return useQuery({
      ...getArtistQueryOptions(artistId),
      ...queryConfig,
      enabled: Boolean(artistId && artistId.trim() !== "" && artistId !== "undefined") && isConfigEnabled && hasAuth,
   });
};
