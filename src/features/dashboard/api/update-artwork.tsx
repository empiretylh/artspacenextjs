// src/features/art/update-art.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Artwork } from "@/types";
import { getUploadedArtworksQueryOptions } from "./get-uploaded-artworks";
import { getArtworkQueryOptions } from "./get-artwork";
import type { AxiosResponse } from "axios";

// ✅ Define schema (can reuse createArtInputSchema)
export const updateArtInputSchema = z.object({
   category: z.number(),
   title: z.string().min(2, "Title must be at least 2 characters."),
   description: z
      .string()
      .min(10, "Description must be at least 10 characters."),
   dimensions: z.string().min(3, "Dimension must be at least 3 characters."),
   price: z.number().min(1, "Price must be greater than 0."),
   year: z.number().min(1900).max(new Date().getFullYear()),
   status: z.enum(["AVAILABLE", "SOLD", "COMING_SOON"]),
   image: z.instanceof(File).optional(),
});

export type UpdateArtInput = z.infer<typeof updateArtInputSchema>;

// ✅ API call for updating artwork
export const updateArt = async ({
   id,
   data,
}: {
   id: string;
   data: UpdateArtInput;
}): Promise<AxiosResponse<Artwork>> => {
   return api.patch(`/artworks/artworks/${id}/`, data);
};

// ✅ React Query hook for mutation
type UseUpdateArtOptions = {
   mutationConfig?: MutationConfig<typeof updateArt>;
};

export const useUpdateArt = ({ mutationConfig }: UseUpdateArtOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: updateArt,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: [getUploadedArtworksQueryOptions().queryKey?.[0]],
         });
         queryClient.invalidateQueries({
            queryKey: getArtworkQueryOptions(args[0].data.id).queryKey,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
