// src/features/art/update-art.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Artwork } from "@/types";
import { queryKeys } from "@/config/query-keys";

/* -------------------------------------------------------
   1. Validation Schema
   - All fields optional EXCEPT id
------------------------------------------------------- */

export const updateArtInputSchema = z
   .object({
      id: z.string(),

      category: z.number().optional(),
      title: z.string().min(2).optional(),
      description: z.string().optional(),
      dimensions: z.string().min(3).optional(),

      // Allow zero, enforce business rule in refine
      price: z.number().min(0).optional(),

      year: z.number().min(1900).max(new Date().getFullYear()).optional(),

      status: z
         .enum(["AVAILABLE", "SOLD", "NOT_FOR_SALE", "SOLD_OUT"])
         .optional(),
      current_owner: z.any().optional(),
      are_u_owner: z.boolean().optional(),
      current_owner_name: z.string().optional(),
      visibility: z.enum(["PRIVATE", "PUBLIC"]).optional(),
      genre: z.number().optional(),
      hide_price: z.boolean().optional(),

      styles_artwork_ids: z
         .array(z.object({ label: z.string(), value: z.string() }))
         .min(1, "Select at least one style")
         .optional(),

      image: z
         .array(z.string())
         .min(1, "At least one image is required")
         .optional(),

      search_keywords: z.array(z.string()).optional(),
   })
   // Owner rule
   .refine(
      (data) =>
         data.are_u_owner === undefined ||
         data.are_u_owner === true ||
         !!data.current_owner_name,
      {
         message: "Current Owner Name is required if you are not the owner",
         path: ["current_owner_name"],
      }
   );
// Price vs hide_price rule
// .refine(
//    (data) =>
//       data.price === undefined || data.hide_price === true || data.price > 0,
//    {
//       message: "Price must be greater than 0 unless price is hidden",
//       path: ["price"],
//    }
// );

export type UpdateArtInput = z.infer<typeof updateArtInputSchema>;

/* -------------------------------------------------------
   2. Payload Transformer (Inspired by eventUpdate)
------------------------------------------------------- */

const transformUpdatePayload = (data: UpdateArtInput) => {
   const payload: Record<string, any> = {};

   if (data.category !== undefined) payload.category = data.category;
   if (data.title !== undefined) payload.title = data.title;
   if (data.description !== undefined) payload.description = data.description;
   if (data.dimensions !== undefined) payload.dimensions = data.dimensions;
   if (data.price !== undefined) payload.price = data.price;
   if (data.year !== undefined) payload.year = data.year;
   if (data.status !== undefined) payload.status = data.status;
   if (data.visibility !== undefined) payload.visibility = data.visibility;
   if (data.genre !== undefined) payload.genre = data.genre;
   if (data.hide_price !== undefined) payload.hide_price = data.hide_price;

   if (data.hide_price) {
      delete payload.price;
   }

   if (data.are_u_owner !== undefined) {
      payload.are_u_owner = data.are_u_owner;

      if (data.are_u_owner) {
         payload.current_owner_name = null;
      } else if (data.current_owner_name !== undefined) {
         payload.current_owner_name = data.current_owner_name;
      }
   }

   if (data.current_owner !== undefined) {
      payload.current_owner = data.current_owner;
   }

   if (data.styles_artwork_ids !== undefined) {
      payload.styles_artwork_ids = data.styles_artwork_ids
         .map((style) => Number(style.value))
         .join(",");
   }

   if (data.image !== undefined) {
      payload.image = data.image[0];
   }

   if (data.search_keywords !== undefined && data.search_keywords.length > 0) {
      payload.search_keywords = data.search_keywords;
   }

   return payload;
};

/* -------------------------------------------------------
   3. API Call
------------------------------------------------------- */

export const updateArt = async ({
   data,
}: {
   data: UpdateArtInput;
}): Promise<Artwork> => {
   const payload = transformUpdatePayload(data);

   return api.patch(`/artworks/artworks/${data.id}/`, payload);
};

/* -------------------------------------------------------
   4. React Query Mutation Hook
------------------------------------------------------- */

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
            queryKey: queryKeys.artwork.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
