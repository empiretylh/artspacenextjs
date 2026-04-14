import { doc, updateDoc, deleteField, FieldPath } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { useCallback } from "react";

export const useMarkRead = () => {
   const { user } = useAuth();

   const markAsRead = useCallback(async (conversationId: string | null) => {
      if (!user?.id || !db || !conversationId) return;

      try {
         const convRef = doc(db, "conversations", conversationId);
         
         // Using the variadic version of updateDoc allows us to pass 
         // a FieldPath object directly as a key to target the "junk" 
         // field with a literal dot in its name.
         await updateDoc(
            convRef, 
            `unreadCount.${user.id}`, 0, // Target: nested map field
            new FieldPath(`unreadCount.${user.id}`), deleteField() // Target: literal field with dot
         );
      } catch (err) {
         console.error("Error marking conversation as read:", err);
      }
   }, [user?.id]);

   return { markAsRead };
};
