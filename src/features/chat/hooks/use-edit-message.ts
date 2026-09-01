import { doc, updateDoc, serverTimestamp, getDoc, deleteField } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { Message } from "../types";
import { extractFirstUrl } from "../utils/link-detector";

export const useEditMessage = (conversationId: string | null) => {
   const { user } = useAuth();

   const editMessage = async (message: Message, newContent: string) => {
      const trimmed = newContent.trim();
      if (!user?.id || !conversationId || !db || !trimmed) return;
      if (message.senderId !== String(user.id)) return;
      if (message.content === trimmed) return;

      try {
         const messageRef = doc(db, "conversations", conversationId, "messages", message.id);
         const detectedUrl = extractFirstUrl(trimmed);
         
         const updates: Record<string, any> = {
            content: trimmed,
            isEdited: true,
            editedAt: serverTimestamp(),
         };

         // If URL changed or removed
         if (!detectedUrl && message.linkPreview) {
            updates.linkPreview = deleteField();
         }

         await updateDoc(messageRef, updates);

         // If a new or different URL is present, attempt to fetch link preview
         if (detectedUrl && (!message.linkPreview || message.linkPreview.url !== detectedUrl)) {
            fetch(`/api/chat/link-preview?url=${encodeURIComponent(detectedUrl)}`)
               .then(async (res) => {
                  if (res.ok) {
                     const previewData = await res.json();
                     if (previewData && (previewData.title || previewData.description || previewData.image)) {
                        await updateDoc(messageRef, { linkPreview: previewData });
                     }
                  }
               })
               .catch((err) => console.warn("Link preview update failed:", err));
         }

         // Update lastMessage on conversation if this was the latest message
         const convRef = doc(db, "conversations", conversationId);
         const convSnap = await getDoc(convRef);
         if (convSnap.exists()) {
            const convData = convSnap.data();
            // If the conversation lastMessage matches the old message content, update it
            if (convData.lastMessage === message.content) {
               await updateDoc(convRef, {
                  lastMessage: trimmed,
               });
            }
         }
      } catch (err) {
         console.error("Error editing message:", err);
         throw err;
      }
   };

   return { editMessage };
};
