import { doc, setDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";
import { UserRouteType } from "./get-users";
import { db } from "../firebase/firebase";
import { useAuth } from "@/features/auth/store";

export const blockUser = ({
   userId,
   userType,
}: {
   userId: string;
   userType: UserRouteType;
}): Promise<Artwork> => {
   return api.post(`/reports/users/${userId}/block/`);
};

type UseBlockUserOptions = {
   mutationConfig?: MutationConfig<typeof blockUser>;
};

export const useBlockUser = ({ mutationConfig }: UseBlockUserOptions = {}) => {
   const queryClient = useQueryClient();
   const { user } = useAuth();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: blockUser,

      onSuccess: async (...args) => {
         const variables = args[1];

         // --- IMMEDIATE FIRESTORE SYNC ---
         // 1. Update the Hybrid "Enforcer" (Conversation Metadata)
         if (db && user?.id) {
            try {
               const participants = [String(user.id), String(variables.userId)].sort();
               const conversationId = `one-on-one-${participants.join("-")}`;
               
               const convRef = doc(db, "conversations", conversationId);
               // We use setDoc with merge: true because the conversation might not exist yet
               await setDoc(convRef, {
                  blockedBy: {
                     [user.id]: true
                  }
               }, { merge: true });

               // 2. Update the Private "Source of Truth"
               const blockRef = doc(db, "users", String(user.id), "blocks", String(variables.userId));
               await setDoc(blockRef, {
                  blockedAt: new Date().toISOString()
               });
            } catch (err) {
               console.error("Firestore sync error during block:", err);
            }
         }

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.blocked.all,
         });

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.detail(variables.userType, variables.userId),
         });

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.blocked.status(variables.userId, variables.userType),
         });

         onSuccess?.(...args);
      },

      ...restConfig,
   });
};
