"use client";

import { useEffect, useState } from "react";
import { 
   doc, 
   onSnapshot, 
   setDoc, 
   deleteDoc, 
   updateDoc,
   deleteField,
   serverTimestamp 
} from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { useGetUserBlockStatus } from "@/features/service/artspace/user-block-status";
import { UserRouteType } from "@/features/service/artspace/get-users";

/**
 * Hook to handle real-time chat security and backend block synchronization.
 * This implements the "Hybrid" pattern where:
 * 1. Private block lists are kept strict (owner-only).
 * 2. Block status is mirrored to the Conversation document's 'blockedBy' map.
 * 3. The UI and Rules check 'blockedBy' for instant, private enforcement.
 */
export const useChatSecurity = (
   conversationId: string | null,
   recipientId: string | null, 
   userType: UserRouteType = "artists"
) => {
   const { user: currentUser } = useAuth();
   const [isBlockedByMe, setIsBlockedByMe] = useState(false);
   const [hasBlockedMe, setHasBlockedMe] = useState(false);
   const [loading, setLoading] = useState(true);

   // 1. Backend Authority Check (Self-Healing Trigger)
   const { data: backendIsBlocked, isLoading: backendLoading } = useGetUserBlockStatus({
      userId: recipientId || "",
      userType,
      queryConfig: {
         enabled: !!recipientId,
      },
   });

   useEffect(() => {
      if (!recipientId || !currentUser?.id || !db) {
         setLoading(false);
         return;
      }

      const myId = String(currentUser.id);
      const theirId = recipientId;

      // A. Sync Backend Authority -> Private List & Conversation Metadata
      const syncBlockToFirestore = async () => {
         if (backendIsBlocked !== undefined) {
            const myBlockRef = doc(db!, "users", myId, "blocks", theirId);
            try {
               if (backendIsBlocked) {
                  // Update Private List
                  await setDoc(myBlockRef, { 
                     syncedAt: serverTimestamp(),
                     reason: "backend_sync" 
                  }, { merge: true });

                  // Update Conversation Metadata (Mirror)
                  if (conversationId) {
                     await updateDoc(doc(db!, "conversations", conversationId), {
                        [`blockedBy.${myId}`]: true
                     });
                  }
               } else {
                  // Remove from Private List
                  await deleteDoc(myBlockRef);

                  // Remove from Conversation Metadata (Mirror)
                  if (conversationId) {
                     await updateDoc(doc(db!, "conversations", conversationId), {
                        [`blockedBy.${myId}`]: deleteField()
                     });
                  }
               }
            } catch (err) {
               console.error("Failed to sync block status:", err);
            }
         }
      };

      syncBlockToFirestore();

      // B. Listener: Monitor my own block list
      const myBlockRef = doc(db!, "users", myId, "blocks", theirId);
      const unsubscribeMyBlock = onSnapshot(myBlockRef, async (snap) => {
         const exists = snap.exists();
         setIsBlockedByMe(exists);

         // Ensure Conversation metadata matches my current block status
         if (conversationId) {
            try {
               await updateDoc(doc(db!, "conversations", conversationId), {
                  [`blockedBy.${myId}`]: exists ? true : deleteField()
               });
            } catch (err) {
               // Might fail if user loses participant permission
            }
         }
      });

      // C. Listener: Monitor the Conversation document for block metadata
      // This is the Hybrid "Enforcer" - it's public to participants but keeps 
      // the actual block reasons/lists private.
      let unsubscribeConv = () => {};
      if (conversationId) {
         unsubscribeConv = onSnapshot(doc(db!, "conversations", conversationId), (snap) => {
            if (snap.exists()) {
               const data = snap.data();
               const blockedBy = data.blockedBy || {};
               
               // If anyone other than ME is in the blockedBy map, they have blocked me.
               const othersBlocked = Object.keys(blockedBy).some(uid => uid !== myId);
               setHasBlockedMe(othersBlocked);
            }
         });
      }

      setLoading(false);

      return () => {
         unsubscribeMyBlock();
         unsubscribeConv();
      };
   }, [recipientId, conversationId, currentUser?.id, backendIsBlocked]);

   return {
      isBlockedByMe,
      hasBlockedMe,
      isBlocked: isBlockedByMe || hasBlockedMe, 
      loading: loading || (!!recipientId && backendLoading),
   };
};
