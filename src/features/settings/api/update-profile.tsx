import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

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
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: updateProfile,
      onSuccess: (data, ...args) => {
         // refetch user profile query
         queryClient.invalidateQueries({
            queryKey: getProfileQueryOptions().queryKey,
         });
         onSuccess?.(data, ...args);
      },
      ...restConfig,
   });
};
