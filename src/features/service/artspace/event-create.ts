import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import { generateFormdata } from "@/lib/utils";
import { queryKeys } from "@/config/query-keys";

export const eventCreateInputSchema = z.object({
   title: z.string().min(2),
   slug: z.string().min(2),
   event_type: z.enum(["SOLO", "GROUP", "COLLECTOR"]),
   about: z.string().min(10),
   cover_photo: z.array(z.string()),
   event_logo: z.array(z.string()),
   //  artists_ids: z.array(z.string().or(z.number())),
   artists_ids: z.array(z.object({ label: z.string(), value: z.string() })),
   artworks_ids: z.array(z.object({ label: z.string(), value: z.string() })),
   //  artworks_ids: z.array(z.string()),
   images: z.any().optional(),
   start_date: z.date(),
   end_date: z.date(),
   show_popup: z.boolean(),
   popup_start: z.date().optional(),
   popup_end: z.date().optional(),
   is_published: z.boolean(),
});

export type EventCreateInput = z.infer<typeof eventCreateInputSchema>;

export const eventCreate = async ({ data }: { data: EventCreateInput }) => {
   const newArtistsIds = data.artists_ids.map((artist) => Number(artist.value));
   const newArtworksIds = data.artworks_ids.map((artwork) => artwork.value);

   const newData = {
      ...data,
      cover_photo: data.cover_photo[0],
      event_logo: data.event_logo[0],
      artists: newArtistsIds,
      artworks: newArtworksIds,
      start_date: data.start_date.toISOString(),
      end_date: data.end_date.toISOString(),
      popup_start: data.popup_start
         ? data.popup_start.toISOString()
         : undefined,
      popup_end: data.popup_end ? data.popup_end.toISOString() : undefined,
   };

   console.log(newData);

   return api.post("/artworks/events/", newData);
};

type UseEventCreateOptions = {
   mutationConfig?: MutationConfig<typeof eventCreate>;
};

export const useEventCreate = ({
   mutationConfig,
}: UseEventCreateOptions = {}) => {
   const { onSuccess, ...restConfig } = mutationConfig || {};
   const queryClient = useQueryClient();

   return useMutation({
      mutationFn: eventCreate,
      onSuccess: (...args) => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.event.all,
         });
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
