import { useEffect, useState } from "react";
import { 
   collection, 
   query, 
   orderBy, 
   onSnapshot,
   type QuerySnapshot
} from "firebase/firestore";
import { db, auth } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { Message } from "../types";

export const useMessages = (conversationId: string | null) => {
   const { user } = useAuth();
   const [messages, setMessages] = useState<Message[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
      // 1. Reset messages if no conversation
      if (!conversationId || !db) {
         setMessages([]);
         return;
      }

      // 2. Wait for Firebase Auth to be ready
      // This prevents "Missing or insufficient permissions" errors
      if (!auth?.currentUser) {
         setLoading(true); // Keep loading while waiting for auth
         return;
      }

      // 3. Optional: Verify that Firebase Auth UID matches our session user
      if (user?.id && auth.currentUser.uid !== String(user.id)) {
         return;
      }

      setLoading(true);
      const q = query(
         collection(db, "conversations", conversationId, "messages"),
         orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
         q,
         (snapshot: QuerySnapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            })) as Message[];
            
            setMessages(msgs);
            setError(null);
            setLoading(false);
         },
         (err) => {
            console.error("Error fetching messages:", err);
            setError(err);
            setLoading(false);
         }
      );

      return () => unsubscribe();
   }, [conversationId, auth?.currentUser?.uid, user?.id]);

   return { messages, loading, error };
};
