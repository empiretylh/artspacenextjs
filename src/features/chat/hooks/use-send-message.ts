import {
   collection,
   doc,
   setDoc,
   addDoc,
   getDoc,
   serverTimestamp,
   runTransaction,
   increment
} from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { ChatUser } from "../types";

export const useSendMessage = (conversationId: string | null) => {
   const { user } = useAuth();

   const sendMessage = async (
      content: string, 
      recipient?: ChatUser, 
      type: 'text' | 'image' = 'text',
      mediaUrls?: string[]
   ) => {
      const hasMedia = mediaUrls && mediaUrls.length > 0;
      if (!user?.id || !db || (!content.trim() && !hasMedia)) return;

      try {
         let targetId = conversationId;

         // 1. Handle Lazy Creation
         if (!targetId && recipient) {
            const participants = [String(user.id), String(recipient.id)].sort();
            targetId = `one-on-one-${participants.join("-")}`;

            const convRef = doc(db!, "conversations", targetId);

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
               lastMessage: type === 'image' ? "Sent an image" : content,
               updatedAt: serverTimestamp(),
            }, { merge: true });
         }

         if (targetId) {
            const convSnap = await getDoc(doc(db!, "conversations", targetId));
            const convData = convSnap.data();
            
            if (convData?.blockedBy && Object.keys(convData.blockedBy).length > 0) {
               throw new Error("BLOCK_EXISTS");
            }

            const messagesRef = collection(db!, "conversations", targetId, "messages");
            await addDoc(messagesRef, {
               senderId: String(user.id),
               content,
               type,
               ...(hasMedia && { mediaUrls }),
               createdAt: serverTimestamp(),
            });

            const convRef = doc(db!, "conversations", targetId);
            const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
            
            await runTransaction(db!, async (transaction) => {
               const convSnap = await transaction.get(convRef);
               const convData = convSnap.data();
               const participants = (convData?.participants || []) as string[];
               
               const newUnreadCount: Record<string, any> = { ...convData?.unreadCount };
               participants.forEach(pId => {
                  if (pId !== String(user.id)) {
                     const current = newUnreadCount[pId] || 0;
                     newUnreadCount[pId] = current + 1;
                  }
               });

               transaction.set(convRef, {
                  lastMessage: type === 'image' ? "Sent an image" : content,
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

            // Trigger Notification
            if (recipient?.id) {
               fetch('/api/chat/notify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                     recipientId: recipient.id,
                     senderName: name,
                     conversationId: targetId
                  })
               }).catch(err => console.error("Notification trigger failed:", err));
            } else if (targetId) {
               // Fallback: Get recipient from conversation participants
               const participants = targetId.replace('one-on-one-', '').split('-');
               const otherId = participants.find(p => p !== String(user.id));
               if (otherId) {
                  fetch('/api/chat/notify', {
                     method: 'POST',
                     headers: { 'Content-Type': 'application/json' },
                     body: JSON.stringify({
                        recipientId: otherId,
                        senderName: name,
                        conversationId: targetId
                     })
                  }).catch(err => console.error("Notification trigger failed:", err));
               }
            }
         }

         return targetId;
      } catch (err) {
         console.error("Error sending message:", err);
         throw err;
      }
   };

   return { sendMessage };
};
