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
   last_name: z.string().min(1, "Last name is required"),
   // email: z.string().email("Invalid email address"),
   bio: z.string().optional(),
   website: z.string().url().optional().or(z.literal("")),
   about: z.string().optional(),
   show_email: z.boolean().optional(),
   // profile_picture: z.string().nullable().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileInputSchema>;

// 2️⃣ API call to update profile
export const updateProfile = ({
   data,
}: {
   data: UpdateProfileInput;
}): Promise<AxiosResponse<User>> => {
   const payload = {
      first_name: data.first_name,
      last_name: data.last_name,
      profile: {
         bio: data.bio,
         website: data.website,
         about: data.about,
         show_email: data.show_email,
      },
   };

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
