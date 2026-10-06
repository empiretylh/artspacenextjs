import { doc, updateDoc, serverTimestamp, getDoc, deleteField, arrayUnion } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { Message } from "../types";

export const useDeleteMessage = (conversationId: string | null) => {
   const { user } = useAuth();

   const deleteForEveryone = async (message: Message) => {
      if (!user?.id || !conversationId || !db) return;
      if (message.senderId !== String(user.id)) return;

      try {
         const messageRef = doc(db, "conversations", conversationId, "messages", message.id);

         await updateDoc(messageRef, {
            content: "This message was deleted",
            isDeleted: true,
            deletedAt: serverTimestamp(),
            mediaUrls: deleteField(),
            linkPreview: deleteField(),
            reactions: deleteField(),
            mediaReactions: deleteField(),
         });

         // Update lastMessage on conversation if this was the latest message
         const convRef = doc(db, "conversations", conversationId);
         const convSnap = await getDoc(convRef);
         if (convSnap.exists()) {
            const convData = convSnap.data();
            if (convData.lastMessage === message.content || convData.lastMessage === "Sent an image" || convData.lastMessage === "Sent images") {
               await updateDoc(convRef, {
                  lastMessage: "This message was deleted",
               });
            }
         }
      } catch (err) {
         console.error("Error deleting message for everyone:", err);
         throw err;
      }
   };

   const deleteForMe = async (message: Message) => {
      if (!user?.id || !conversationId || !db) return;

      try {
         const messageRef = doc(db, "conversations", conversationId, "messages", message.id);

         await updateDoc(messageRef, {
            deletedFor: arrayUnion(String(user.id)),
         });
      } catch (err) {
         console.error("Error deleting message for me:", err);
         throw err;
      }
   };

   return { deleteForEveryone, deleteForMe };
};
