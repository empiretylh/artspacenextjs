import { doc, deleteDoc, updateDoc, deleteField } from "firebase/firestore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { api } from "@/lib/api-client";
import type { Artwork } from "@/types";
import type { MutationConfig } from "@/lib/react-query";
import { queryKeys } from "@/config/query-keys";
import { db } from "../firebase/firebase";
import { useAuth } from "@/features/auth/store";

export const unblockUser = ({
   userId,
   userType,
}: {
   userId: string;
   userType: string;
}): Promise<Artwork> => {
   return api.post(`/reports/users/${userId}/unblock/`);
};

type UseUnblockUserOptions = {
   mutationConfig?: MutationConfig<typeof unblockUser>;
};

export const useUnblockUser = ({
   mutationConfig,
}: UseUnblockUserOptions = {}) => {
   const queryClient = useQueryClient();
   const { user } = useAuth();

   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: unblockUser,

      onSuccess: async (...args) => {
         const variables = args[1];

         // --- IMMEDIATE FIRESTORE CLEANUP ---
         if (db && user?.id) {
            try {
               const participants = [String(user.id), String(variables.userId)].sort();
               const conversationId = `one-on-one-${participants.join("-")}`;

               // 1. Remove from Conversation Metadata
               const convRef = doc(db, "conversations", conversationId);
               await updateDoc(convRef, {
                  [`blockedBy.${user.id}`]: deleteField()
               }).catch(() => { /* Ignore if conv doesn't exist */ });

               // 2. Delete from Private Source of Truth
               const blockRef = doc(db, "users", String(user.id), "blocks", String(variables.userId));
               await deleteDoc(blockRef);
            } catch (err) {
               console.error("Firestore cleanup error during unblock:", err);
            }
         }

         queryClient.invalidateQueries({
            queryKey: queryKeys.user.blocked.all,
         });

         switch (variables.userType) {
            case "ARTIST": {
               // detail page
               queryClient.invalidateQueries({
                  queryKey: queryKeys.artist.detail(variables.userId),
               });

               // all artist lists (list + infinite)
               queryClient.invalidateQueries({
                  queryKey: queryKeys.artist.all,
               });

               break;
            }

            case "COLLECTOR": {
               queryClient.invalidateQueries({
                  queryKey: queryKeys.collector.detail(variables.userId),
               });

               queryClient.invalidateQueries({
                  queryKey: queryKeys.collector.all,
               });

               break;
            }

            case "GALLERY": {
               queryClient.invalidateQueries({
                  queryKey: queryKeys.gallery.detail(variables.userId),
               });

               queryClient.invalidateQueries({
                  queryKey: queryKeys.gallery.all,
               });

               break;
            }
         }

         onSuccess?.(...args);
      },

      ...restConfig,
   });
};
