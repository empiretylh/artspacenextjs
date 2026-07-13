import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { FeaturedPhoto } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { getFeaturedPhotosQueryOptions } from "./get-featured-photos";
import { getProfileQueryOptions } from "./get-profile";
import { queryKeys } from "@/config/query-keys";

export const softDeleteFeaturedPhoto = ({
   featuredPhotoId,
}: {
   featuredPhotoId: string;
}): Promise<FeaturedPhoto> => {
   return api.delete(`/users/featured-photos/${featuredPhotoId}/`); // Use PATCH for updates
};

type UseSoftDeleteFeaturedPhotoOptions = {
   mutationConfig?: MutationConfig<typeof softDeleteFeaturedPhoto>;
};

export const useSoftDeleteFeaturedPhoto = ({
   mutationConfig,
}: UseSoftDeleteFeaturedPhotoOptions = {}) => {
   const queryClient = useQueryClient();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: getProfileQueryOptions().queryKey,
         });
         queryClient.invalidateQueries({
            queryKey: getFeaturedPhotosQueryOptions().queryKey,
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.user.all,
         });
         queryClient.invalidateQueries({
            queryKey: queryKeys.artist.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: softDeleteFeaturedPhoto,
   });
};
