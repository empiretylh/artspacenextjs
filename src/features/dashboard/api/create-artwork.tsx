// src/features/art/create-art.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Artwork } from "@/types";
import { getUploadedArtworksQueryOptions } from "./get-uploaded-artworks";
import { generateFormdata } from "@/lib/utils";

// ✅ Define schema
export const createArtInputSchema = z
   .object({
      category: z.number(),
      title: z.string().min(2, "Title must be at least 2 characters."),
      description: z
         .string()
         .min(10, "Description must be at least 10 characters."),
      dimensions: z.string().min(3, "Dimension must be at least 3 characters."),
      price: z.number().min(1, "Price must be greater than 0."),
      year: z.number().min(1900).max(new Date().getFullYear()),
      status: z.enum(["AVAILABLE", "SOLD", "COMING_SOON"]),
      current_owner: z.number().optional(),
      are_u_owner: z.boolean(),
      current_owner_name: z.string().optional(),
      visibility: z.enum(["PRIVATE", "PUBLIC"]),
      image: z.instanceof(File, { message: "Image file is required." }),
   })
   .refine((data) => data.are_u_owner || !!data.current_owner_name, {
      message: "Current Owner Name is required if you are not the owner",
      path: ["current_owner_name"], // attach the error to this field
   });

export type CreateArtInput = z.infer<typeof createArtInputSchema>;

// ✅ Mutation API call
export const createArt = async ({
   data,
}: {
   data: CreateArtInput;
}): Promise<Artwork> => {
   if (data.are_u_owner) {
      delete data.current_owner_name;
   } else {
      delete data.current_owner;
   }
   const formData = generateFormdata(data);

   return api.post(`/artworks/artworks/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
   });
};

// ✅ React Query mutation hook
type UseCreateArtOptions = {
   mutationConfig?: MutationConfig<typeof createArt>;
};

export const useCreateArt = ({ mutationConfig }: UseCreateArtOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: createArt,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: [getUploadedArtworksQueryOptions().queryKey?.[0]],
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
