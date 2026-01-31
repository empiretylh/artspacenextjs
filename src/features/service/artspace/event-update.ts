import { z } from "zod";
import { api } from "@/lib/api-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";

/**
 * ----------------------------------------
 * Schema
 * ----------------------------------------
 * All fields optional EXCEPT id
 */
export const eventUpdateInputSchema = z.object({
   title: z.string().min(2, "Title must be at least 2 characters.").optional(),
   slug: z.string().min(2, "Slug must be at least 2 characters.").optional(),
   event_type: z.enum(["SOLO", "GROUP", "COLLECTOR"]).optional(),
   about: z.string().min(10, "About must be at least 10 characters.").optional(),

   cover_photo: z
      .array(z.string(), "Cover photo is required")
      .min(1, "Cover photo is required")
      .optional(),

   event_logo: z
      .array(z.string(), "Event logo is required")
      .min(1, "Event logo is required")
      .optional(),

   artists_ids: z
      .array(
         z.object({
            label: z.string(),
            value: z.string(),
         })
      ).optional(),

   artworks_ids: z
      .array(
         z.object({
            label: z.string(),
            value: z.string(),
         })
      )
      .optional(),

   images: z.any().optional(),

   start_date: z.date('Start Date must be a valid date').optional(),
   end_date: z.date('End Date must be a valid date').optional(),

   show_popup: z.boolean().optional(),

   popup_start: z.date().optional(),
   popup_end: z.date().optional(),

   is_published: z.boolean().optional(),
}).refine((data) => !(data.show_popup === true && !data.popup_start), {
   message: "Popup Start Date is required when Show Popup is enabled",
   path: ["popup_start"], // attach the error to this field
}).refine((data) => !(data.show_popup === true && !data.popup_end), {
   message: "Popup End Date is required when Show Popup is enabled",
   path: ["popup_end"], // attach the error to this field
});

export type EventUpdateInput = z.infer<typeof eventUpdateInputSchema>;

const transformUpdatePayload = (data: EventUpdateInput) => {
   const payload: Record<string, any> = {};

   if (data.title !== undefined) payload.title = data.title;
   if (data.slug !== undefined) payload.slug = data.slug;
   if (data.event_type !== undefined) payload.event_type = data.event_type;
   if (data.about !== undefined) payload.about = data.about;

   if (data.cover_photo !== undefined) {
      payload.cover_photo = data.cover_photo[0];
   }

   if (data.event_logo !== undefined) {
      payload.event_logo = data.event_logo[0];
   }

   if (data.artists_ids !== undefined) {
      payload.artists = data.artists_ids.map((a) => Number(a.value));
   }

   if (data.artworks_ids !== undefined) {
      payload.artworks = data.artworks_ids.map((a) => a.value);
   }

   if (data.images !== undefined) {
      payload.images = data.images;
   }

   if (data.start_date !== undefined) {
      payload.start_date = data.start_date.toISOString();
   }

   if (data.end_date !== undefined) {
      payload.end_date = data.end_date.toISOString();
   }

   if (data.show_popup !== undefined) {
      payload.show_popup = data.show_popup;
   }

   if (data.popup_start !== undefined) {
      payload.popup_start = data.popup_start
         ? data.popup_start.toISOString()
         : null;
   }

   if (data.popup_end !== undefined) {
      payload.popup_end = data.popup_end ? data.popup_end.toISOString() : null;
   }

   if (data.is_published !== undefined) {
      payload.is_published = data.is_published;
   }

   return payload;
};

export const eventUpdate = async ({
   id,
   data,
}: {
   id: string;
   data: EventUpdateInput;
}) => {
   // const { slug } = data;
   // console.log("Updating event with ID:", transformUpdatePayload(data));
   return api.patch(`/artworks/events/${id}/`, transformUpdatePayload(data));
};

type UseEventUpdateOptions = {
   mutationConfig?: MutationConfig<typeof eventUpdate>;
};

export const useEventUpdate = ({
   mutationConfig,
}: UseEventUpdateOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: eventUpdate,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.event.all,
         });

         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
