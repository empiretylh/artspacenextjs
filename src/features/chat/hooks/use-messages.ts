import { useEffect, useState } from "react";
import { 
   collection, 
   query, 
   orderBy, 
   onSnapshot,
   type QuerySnapshot
} from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import type { ChatMessage } from "../types";

export const useMessages = (conversationId: string | null) => {
   const [messages, setMessages] = useState<ChatMessage[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
      if (!conversationId || !db) {
         setMessages([]);
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
            })) as ChatMessage[];
            
            setMessages(msgs);
            setLoading(false);
         },
         (err) => {
            console.error("Error fetching messages:", err);
            setError(err);
            setLoading(false);
         }
      );

      return () => unsubscribe();
   }, [conversationId]);

   return { messages, loading, error };
};
