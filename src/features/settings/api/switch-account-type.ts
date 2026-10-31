import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSyncUserProfile } from "@/features/chat/hooks/use-sync-user-profile";
import { useAuth } from "@/features/auth/store";
import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { User } from "@/types";
import type { AxiosResponse } from "axios";
import { getProfileQueryOptions } from "./get-profile";

export type SwitchableAccountType = "ARTIST" | "GALLERY" | "COLLECTOR";
export type AccountType = "BUYER" | SwitchableAccountType | "ADMIN";

export interface SwitchAccountTypeInput {
   user_type: SwitchableAccountType;
}

export interface SwitchAccountTypeResponse {
   message: string;
   changed: boolean;
   previous_user_type: string;
   user_type: SwitchableAccountType;
   available_user_types: SwitchableAccountType[];
   user: User;
}

export const ALLOWED_ACCOUNT_SWITCHES: Record<string, SwitchableAccountType[]> = {
   BUYER: ["ARTIST", "GALLERY", "COLLECTOR"],
   ARTIST: ["GALLERY", "COLLECTOR"],
   GALLERY: ["ARTIST", "COLLECTOR"],
   COLLECTOR: ["ARTIST", "GALLERY"],
   ADMIN: [],
};

export const switchAccountType = ({
   data,
}: {
   data: SwitchAccountTypeInput;
}): Promise<AxiosResponse<SwitchAccountTypeResponse>> => {
   return api.post("/users/account-type/switch/", data);
};

type UseSwitchAccountTypeOptions = {
   mutationConfig?: MutationConfig<typeof switchAccountType>;
};

export const useSwitchAccountType = ({
   mutationConfig,
}: UseSwitchAccountTypeOptions = {}) => {
   const queryClient = useQueryClient();
   const { syncProfile } = useSyncUserProfile();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: switchAccountType,
      onSuccess: (response, ...args) => {
         const updatedUser = response.data.user;

         if (updatedUser) {
            // 1. Update React Query profile cache
            queryClient.setQueryData(getProfileQueryOptions().queryKey, (old: any) => {
               if (!old) return { data: updatedUser };
               return { ...old, data: updatedUser };
            });
            queryClient.invalidateQueries({
               queryKey: getProfileQueryOptions().queryKey,
            });

            // 2. Update global auth store (and cookies/session)
            useAuth.getState().updateUser(updatedUser);

            // 3. Sync to Firestore for real-time chat displays
            syncProfile(true, updatedUser);
         }

         onSuccess?.(response, ...args);
      },
      ...restConfig,
   });
};
