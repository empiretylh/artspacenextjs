import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

export const getArtist = ({
   artistId,
}: {
   artistId: string;
}): Promise<AxiosResponse<ApiResponse<User>>> => {
   return api.get(`/users/artist/${artistId}`);
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
   return useQuery({
      ...getArtistQueryOptions(artistId),
      ...queryConfig,
   });
};
