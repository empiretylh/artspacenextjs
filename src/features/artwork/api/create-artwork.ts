// src/features/art/create-art.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Artwork } from "@/types";


import { queryKeys } from "@/config/query-keys";

// ✅ Define schema
export const createArtInputSchema = z
   .object({
      artist: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
      artist_name: z.string().optional(),
      category: z.number("Category is required"),
      currency: z.string().optional(),
      title: z.string().min(2, "Title must be at least 2 characters."),
      description: z.string().optional(),
      dimensions: z.string().min(3, "Dimension must be at least 3 characters."),
      medium: z.string().min(1, "Medium is required."),
      price: z.number().min(1, "Price must be include.").optional(),
      year: z.number().min(1900).max(new Date().getFullYear()),
      status: z.enum(["AVAILABLE", "SOLD", "NOT_FOR_SALE", "SOLD_OUT"]),
      current_owner: z.number().optional(),
      are_u_owner: z.boolean(),
      current_owner_name: z.string().optional(),
      visibility: z.enum(["PRIVATE", "PUBLIC"]),
      genre: z.number("Genre is required"),
      hide_price: z.boolean("Hide Price is required"),
      styles_artwork_ids: z
         .array(z.object({ label: z.string(), value: z.string() }))
         .min(1, "Select at least one style"),
      // image: z.instanceof(File, { message: "Image file is required." }),
      image: z.array(z.string()).min(1, "Artwork Image is required"),
      search_keywords: z.array(z.string()).optional(),
   })
   .refine((data) => data.are_u_owner || !!data.current_owner_name, {
      message: "Current Owner Name is required if you are not the owner",
      path: ["current_owner_name"], // attach the error to this field
   }).superRefine((data, ctx) => {
      if (!data.artist && !data.artist_name) {
         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Artist or Artist Name is required",
            path: ["artist"], // attach the error to this field
         });

         ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Artist or Artist Name is required",
            path: ["artist_name"], // attach the error to this field
         });
      }
   })

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

   const newStyles = data.styles_artwork_ids
      .map((style) => {
         return Number(style.value);
      })
      .join(",");

   if (!data.search_keywords || data.search_keywords?.length <= 0) {
      delete data.search_keywords;
   }

   if (data.hide_price) {
      delete data.price;
   }

   const newPayload = {
      ...data,
      artist: (data.artist && !data.artist_name) ? data.artist[0].value : null,
      artist_name: (data.artist_name && (Array.isArray(data.artist) ? data.artist.length <= 0 : !data.artist)) ? data.artist_name : null,
      styles_artwork_ids: newStyles,
      image: data.image[0],
   };

   // const formData = generateFormdata(newPayload);
   // console.log(newPayload);
   return api.post(`/artworks/artworks/`, newPayload);
};

// ✅ React Query mutation hook
type UseCreateArtOptions = {
   mutationConfig?: MutationConfig<typeof createArt>;
};

export const useCreateArt = ({ mutationConfig }: UseCreateArtOptions = {}) => {
   const { onSuccess, ...restConfig } = mutationConfig || {};
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createArt,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.artwork.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
