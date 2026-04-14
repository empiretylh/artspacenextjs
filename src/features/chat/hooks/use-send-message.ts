import {
   collection,
   doc,
   setDoc,
   addDoc,
   serverTimestamp,
   runTransaction,
   increment
} from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { ChatUser } from "../types";

export const useSendMessage = (conversationId: string | null) => {
   const { user } = useAuth();

   const sendMessage = async (content: string, recipient?: ChatUser) => {
      if (!user?.id || !db || !content.trim()) return;

      try {
         let targetId = conversationId;

         // 1. Handle Lazy Creation (if no conversationId exists)
         if (!targetId && recipient) {
            // Generate a deterministic ID for 1-on-1 to avoid duplicates
            // Or just use a random one. Standard for 1-on-1 is deterministic: sort ids.
            const participants = [String(user.id), String(recipient.id)].sort();
            targetId = `one-on-one-${participants.join("-")}`;

            const convRef = doc(db, "conversations", targetId);

            await setDoc(convRef, {
               participants,
               participantDetails: {
                  [user.id]: {
                     id: String(user.id),
                     name: `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email,
                     avatar: user.profile?.profile_picture || null
                  },
                  [recipient.id]: recipient
               },
               lastMessage: content,
               updatedAt: serverTimestamp(),
            }, { merge: true });
         }

         if (targetId) {
            // 2. Add message to sub-collection
            const messagesRef = collection(db, "conversations", targetId, "messages");
            await addDoc(messagesRef, {
               senderId: String(user.id),
               content,
               createdAt: serverTimestamp(),
            });

            const convRef = doc(db, "conversations", targetId);
            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
            
            // For unreadCount, we need to know participants.
            // In 1-on-1, we can find the other participant from the targetId if it's the deterministic format.
            // However, a more robust way is to use the recipient if provided (lazy) 
            // OR fetch participants if it's an existing conversation.
            
            await runTransaction(db, async (transaction) => {
               const convSnap = await transaction.get(convRef);
               const convData = convSnap.data();
               const participants = (convData?.participants || []) as string[];
               
               // Construct unreadCount map
               const newUnreadCount: Record<string, any> = { ...convData?.unreadCount };
               participants.forEach(pId => {
                  if (pId !== String(user.id)) {
                     const current = newUnreadCount[pId] || 0;
                     // Note: Inside transaction we can compute the new value
                     // rather than using increment() if we have current data
                     newUnreadCount[pId] = current + 1;
                  }
               });

               transaction.set(convRef, {
                  lastMessage: content,
                  updatedAt: serverTimestamp(),
                  participantDetails: {
                     [user.id]: {
                        id: String(user.id),
                        name,
                        avatar: user.profile?.profile_picture || null
                     }
                  },
                  unreadCount: newUnreadCount
               }, { merge: true });
            });
         }

         return targetId;
      } catch (err) {
         console.error("Error sending message:", err);
         throw err;
      }
   };

   return { sendMessage };
};
