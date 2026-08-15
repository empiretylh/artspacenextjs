import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";

export const getCachedGallery = cache((id: string) => getGallery({ galleryId: id }))

export const getGallery = async ({
   galleryId,
}: {
   galleryId: string;
}): Promise<ApiResponse<User>> => {
   const res = await api.get(`/users/profile/public/${galleryId}/`);

   return res.data;
};

export const getGalleryQueryOptions = (galleryId: string) => {
   return queryOptions({
      queryKey: queryKeys.gallery.detail(galleryId),
      queryFn: () => getGallery({ galleryId }),
   });
};

type UseGalleryOptions = {
   galleryId: string;
   queryConfig?: QueryConfig<typeof getGalleryQueryOptions>;
};

export const useGetGallery = ({ galleryId, queryConfig }: UseGalleryOptions) => {
   const { accessToken } = useAuth.getState();

   return useQuery({
      ...getGalleryQueryOptions(galleryId),
      ...queryConfig,
      enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
   });
};
