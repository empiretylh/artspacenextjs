import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { FeaturedPhoto } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { getFeaturedPhotosQueryOptions } from "./get-featured-photos";

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
            queryKey: [getFeaturedPhotosQueryOptions().queryKey?.[0]],
         });
         onSuccess?.(...args);
      },
      ...restConfig,
      mutationFn: softDeleteFeaturedPhoto,
   });
};
