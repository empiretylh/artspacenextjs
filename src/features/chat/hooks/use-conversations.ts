import { useEffect, useState } from "react";
import { 
   collection, 
   query, 
   where, 
   orderBy, 
   onSnapshot,
   type QuerySnapshot
} from "firebase/firestore";
import { db, auth } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { useDocumentVisibility } from "@/hooks/use-document-visibility";
import type { Conversation } from "../types";

export const useConversations = () => {
   const { user } = useAuth();
   const isVisible = useDocumentVisibility();
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
      // Pause listener if document is not visible or no user session
      if (!db || !user?.id || !isVisible) {
         setLoading(false);
         return;
      }

      const q = query(
         collection(db, "conversations"),
         where("participants", "array-contains", String(user.id)),
         orderBy("updatedAt", "desc")
      );

      const unsubscribe = onSnapshot(
         q,
         (snapshot: QuerySnapshot) => {
            const convs = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            })) as Conversation[];
            
            setConversations(convs);
            setError(null);
            setLoading(false);
            if (process.env.NODE_ENV === "development") {
               console.log("Chat: Conversations listener active", convs.length);
            }
         },
         (err) => {
            console.error("Error fetching conversations:", err);
            setError(err);
            setLoading(false);
         }
      );

      return () => {
         unsubscribe();
         if (process.env.NODE_ENV === "development") {
            console.log("Chat: Conversations listener unsubscribed");
         }
      };
   }, [user?.id, auth?.currentUser?.uid, isVisible]);

   return { conversations, loading, error };
};
