import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

export const getGallery = ({
   galleryId,
}: {
   galleryId: string;
}): Promise<AxiosResponse<ApiResponse<User>>> => {
   return api.get(`/users/gallery/${galleryId}`);
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

export const useGetGallery = ({
   galleryId,
   queryConfig,
}: UseGalleryOptions) => {
   return useQuery({
      ...getGalleryQueryOptions(galleryId),
      ...queryConfig,
   });
};
