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
export const changeProfileCoverInputSchema = z.object({
   cover_photo: z.instanceof(File).optional(),
});

export type ChangeProfileCoverInput = z.infer<
   typeof changeProfileCoverInputSchema
>;

// ✅ API call for updating artwork
export const changeProfileCover = async ({
   data,
}: {
   data: ChangeProfileCoverInput;
}): Promise<AxiosResponse<Artwork>> => {
   return api.patch(`/users/profile/cover/`, generateFormdata(data));
};

// ✅ React Query hook for mutation
type UseChangeProfileCoverOptions = {
   mutationConfig?: MutationConfig<typeof changeProfileCover>;
};

export const useChangeProfileCover = ({
   mutationConfig,
}: UseChangeProfileCoverOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: changeProfileCover,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: getProfileQueryOptions().queryKey,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
