import { useEffect, useState } from "react";
import { 
   collection, 
   query, 
   orderBy, 
   onSnapshot,
   limit,
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
   const [limitAmount, setLimitAmount] = useState(10); // Increased as user scrolls
   const [hasMore, setHasMore] = useState(true);

   useEffect(() => {
      // 1. Reset messages if no conversation
      if (!conversationId || !db) {
         setMessages([]);
         return;
      }

      setLoading(true);
      const q = query(
         collection(db, "conversations", conversationId, "messages"),
         orderBy("createdAt", "desc"),
         limit(limitAmount)
      );

      const unsubscribe = onSnapshot(
         q,
         (snapshot: QuerySnapshot) => {
            const msgs = snapshot.docs.map((doc) => ({
               id: doc.id,
               ...doc.data(),
            })) as Message[];
            
            setMessages(msgs);
            setHasMore(msgs.length === limitAmount);
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
   }, [conversationId, auth?.currentUser?.uid, user?.id, limitAmount]);

   const loadMore = () => {
      if (hasMore && !loading) {
         setLimitAmount((prev) => prev + 10);
      }
   };

   return { 
      messages, 
      loading, 
      error, 
      hasMore, 
      loadMore 
   };
};
