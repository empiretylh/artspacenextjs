import {
   collection,
   doc,
   setDoc,
   addDoc,
   serverTimestamp,
   runTransaction
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

            // 3. Update conversation root metadata (including self-healing details)
            const convRef = doc(db, "conversations", targetId);
            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
            
            await setDoc(convRef, {
               lastMessage: content,
               updatedAt: serverTimestamp(),
               participantDetails: {
                  [user.id]: {
                     id: String(user.id),
                     name,
                     avatar: user.profile?.profile_picture || null
                  }
               }
            }, { merge: true });
         }

         return targetId;
      } catch (err) {
         console.error("Error sending message:", err);
         throw err;
      }
   };

   return { sendMessage };
};
