// src/features/art/update-art.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Artwork } from "@/types";
import type { AxiosResponse } from "axios";
import { generateFormdata } from "@/lib/utils";
import { getProfileQueryOptions } from "./get-profile";

// ✅ Define schema (can reuse createArtInputSchema)
export const changeProfilePictureInputSchema = z.object({
   profile_picture: z.instanceof(File).optional(),
});

export type ChangeProfilePictureInput = z.infer<
   typeof changeProfilePictureInputSchema
>;

// ✅ API call for updating artwork
export const changeProfilePicture = async ({
   data,
}: {
   data: ChangeProfilePictureInput;
}): Promise<AxiosResponse<Artwork>> => {
   return api.patch(`/users/profile/picture/`, generateFormdata(data));
};

// ✅ React Query hook for mutation
type UseChangeProfilePictureOptions = {
   mutationConfig?: MutationConfig<typeof changeProfilePicture>;
};

export const useChangeProfilePicture = ({
   mutationConfig,
}: UseChangeProfilePictureOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: changeProfilePicture,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: getProfileQueryOptions().queryKey,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
