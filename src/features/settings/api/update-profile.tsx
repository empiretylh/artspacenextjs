import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useSyncUserProfile } from "@/features/chat/hooks/use-sync-user-profile";
import { useAuth } from "@/features/auth/store";
import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { User } from "@/types";
import type { AxiosResponse } from "axios";
import { getProfileQueryOptions } from "./get-profile";

// 1️⃣ Validation Schema for updating profile
export const updateProfileInputSchema = z.object({
   first_name: z.string().min(1, "First name is required"),
   last_name: z.string().optional(),
   // email: z.string().email("Invalid email address"),
   bio: z.string().max(150, "Bio cannot exceed 150 characters").optional(),
   website: z.string().url().optional().or(z.literal("")),
   about: z.string().optional(),
   show_email: z.boolean().optional(),
   hide_collector_name: z.boolean().optional(),
   // profile_picture: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

// 2️⃣ API call to update profile
export const updateProfile = ({
   data,
}: {
   data: Partial<UpdateProfileInput>;
}): Promise<AxiosResponse<User>> => {
   const payload: Record<string, unknown> = {};

   if (data.first_name !== undefined) payload.first_name = data.first_name;
   if (data.last_name !== undefined) payload.last_name = data.last_name;
   if (data.hide_collector_name !== undefined) {
      payload.hide_collector_name = data.hide_collector_name;
   }

   const profilePayload: Record<string, unknown> = {};
   if (data.bio !== undefined) profilePayload.bio = data.bio;
   if (data.website !== undefined) profilePayload.website = data.website;
   if (data.about !== undefined) profilePayload.about = data.about;
   if (data.show_email !== undefined) profilePayload.show_email = data.show_email;
   if (data.hide_collector_name !== undefined) {
      profilePayload.hide_collector_name = data.hide_collector_name;
   }

   if (Object.keys(profilePayload).length > 0) {
      payload.profile = profilePayload;
   }

   return api.patch(`/users/profile/me/`, payload);
};

// 3️⃣ Hook for using mutation
type UseUpdateProfileOptions = {
   mutationConfig?: MutationConfig<typeof updateProfile>;
};

export const useUpdateProfile = ({
   mutationConfig,
}: UseUpdateProfileOptions = {}) => {
   const queryClient = useQueryClient();
   const { syncProfile } = useSyncUserProfile();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: updateProfile,
      onSuccess: (data, ...args) => {
         // 1. Refetch user profile query
         queryClient.setQueryData(getProfileQueryOptions().queryKey, data);
         queryClient.invalidateQueries({
            queryKey: getProfileQueryOptions().queryKey,
         });

         // 2. Update global auth state immediately
         useAuth.getState().updateUser(data.data);

         // 3. Sync to Firestore (retroactively update chats)
         syncProfile(true);

         onSuccess?.(data, ...args);
      },
      ...restConfig,
   });
};
