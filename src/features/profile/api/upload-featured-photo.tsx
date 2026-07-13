// src/features/art/update-art.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Artwork } from "@/types";
import type { AxiosResponse } from "axios";
import { generateFormdata } from "@/lib/utils";
import { getProfileQueryOptions } from "./get-profile";
import { getFeaturedPhotosQueryOptions } from "./get-featured-photos";
import { queryKeys } from "@/config/query-keys";

// ✅ Define schema (can reuse createArtInputSchema)
export const uploadFeaturedPhotoInputSchema = z.object({
   image: z.instanceof(File).optional(),
});

export type UploadFeaturedPhotoInput = z.infer<
   typeof uploadFeaturedPhotoInputSchema
>;

// ✅ API call for updating artwork
export const uploadFeaturedPhoto = async ({
   data,
}: {
   data: UploadFeaturedPhotoInput;
}): Promise<AxiosResponse<Artwork>> => {
   return api.post(`/users/featured-photos/`, generateFormdata(data));
};

// ✅ React Query hook for mutation
type UseUploadFeaturedPhotoOptions = {
   mutationConfig?: MutationConfig<typeof uploadFeaturedPhoto>;
};

export const useUploadFeaturedPhoto = ({
   mutationConfig,
}: UseUploadFeaturedPhotoOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: uploadFeaturedPhoto,
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
   });
};
