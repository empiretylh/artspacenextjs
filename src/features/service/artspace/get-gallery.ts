import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";

export const getCachedGallery = cache((id: string) => getGallery({ galleryId: id }));

export const getGallery = async ({
   galleryId,
}: {
   galleryId: string;
}): Promise<ApiResponse<User>> => {
   if (!galleryId || galleryId.trim() === "") {
      throw new Error("galleryId is required to get gallery");
   }
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
   const isConfigEnabled = queryConfig?.enabled !== undefined ? Boolean(queryConfig.enabled) : true;
   const hasAuth = accessToken === null || !!accessToken;

   return useQuery({
      ...getGalleryQueryOptions(galleryId),
      ...queryConfig,
      enabled: Boolean(galleryId && galleryId.trim() !== "" && galleryId !== "undefined") && isConfigEnabled && hasAuth,
   });
};
