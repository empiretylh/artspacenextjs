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

// ✅ Define schema (can reuse createArtInputSchema)
export const editFeaturedPhotoInputSchema = z.object({
   image: z.instanceof(File).optional(),
});

export type EditFeaturedPhotoInput = z.infer<
   typeof editFeaturedPhotoInputSchema
>;

// ✅ API call for updating artwork
export const editFeaturedPhoto = async ({
   data,
   id,
}: {
   data: EditFeaturedPhotoInput;
   id: string;
}): Promise<AxiosResponse<Artwork>> => {
   return api.patch(`/users/featured-photos/${id}/`, generateFormdata(data));
};

// ✅ React Query hook for mutation
type UseEditFeaturedPhotoOptions = {
   mutationConfig?: MutationConfig<typeof editFeaturedPhoto>;
};

export const useEditFeaturedPhoto = ({
   mutationConfig,
}: UseEditFeaturedPhotoOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: editFeaturedPhoto,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: getProfileQueryOptions().queryKey,
         });
         queryClient.invalidateQueries({
            queryKey: getFeaturedPhotosQueryOptions().queryKey,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
