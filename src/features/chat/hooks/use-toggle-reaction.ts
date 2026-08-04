import { doc, updateDoc, deleteField } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { Message } from "../types";

export const useToggleReaction = (conversationId: string | null) => {
   const { user } = useAuth();

   const toggleReaction = async (message: Message, emoji: string, imageIndex?: number) => {
      if (!user?.id || !conversationId || !db) return;

      try {
         const messageRef = doc(db, "conversations", conversationId, "messages", message.id);
         const currentReaction = imageIndex !== undefined
            ? message.mediaReactions?.[String(imageIndex)]?.[user.id]
            : message.reactions?.[user.id];
         const isRemoving = currentReaction === emoji;

         if (isRemoving) {
            // User clicked the same emoji: remove reaction
            if (imageIndex !== undefined) {
               await updateDoc(messageRef, {
                  [`mediaReactions.${imageIndex}.${user.id}`]: deleteField()
               });
            } else {
               await updateDoc(messageRef, {
                  [`reactions.${user.id}`]: deleteField()
               });
            }
         } else {
            // Add or update reaction
            if (imageIndex !== undefined) {
               await updateDoc(messageRef, {
                  [`mediaReactions.${imageIndex}.${user.id}`]: emoji
               });
            } else {
               await updateDoc(messageRef, {
                  [`reactions.${user.id}`]: emoji
               });
            }
         }

         // Trigger notification only if reacting to someone else's message and NOT removing
         if (message.senderId !== String(user.id) && !isRemoving) {
            const senderName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
            
            fetch('/api/chat/notify', {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify({
                  recipientId: message.senderId,
                  senderName: senderName,
                  conversationId: conversationId,
                  type: 'chat_reaction',
                  title: 'New Reaction',
                  body: imageIndex !== undefined
                     ? `${senderName} reacted with ${emoji} to your image`
                     : `${senderName} reacted with ${emoji} to your message`
               })
            }).catch(err => console.error("Reaction notification trigger failed:", err));
         }
      } catch (err) {
         console.error("Error toggling reaction:", err);
         throw err;
      }
   };

   return { toggleReaction };
};
