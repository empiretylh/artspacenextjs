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
import { useDocumentVisibility } from "@/hooks/use-document-visibility";
import type { Message } from "../types";

export const useMessages = (conversationId: string | null) => {
   const { user } = useAuth();
   const isVisible = useDocumentVisibility();
   const [messages, setMessages] = useState<Message[]>([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState<Error | null>(null);
   const [limitAmount, setLimitAmount] = useState(10); // Increased as user scrolls
   const [hasMore, setHasMore] = useState(true);

   useEffect(() => {
      // 1. Reset messages if no conversation
      if (!conversationId || !db || !auth?.currentUser) {
         setMessages([]);
         setLoading(false);
         return;
      }

      // 2. Pause if not visible
      if (!isVisible) {
         return;
      }

      setLoading(true);
      setError(null);
      
      const q = query(
         collection(db, "conversations", conversationId, "messages"),
         orderBy("createdAt", "desc"),
         limit(limitAmount)
      );

      const unsubscribe = onSnapshot(
         q,
         (snapshot: QuerySnapshot) => {
               const currentUid = user?.id ? String(user.id) : null;
               const msgs = snapshot.docs
                  .map((doc) => {
                     const data = doc.data();
                     const message = {
                        id: doc.id,
                        type: data.type || 'text',
                        ...data,
                     } as any;

                     // Grouped images normalization
                     if (message.type === 'image' && !message.mediaUrls) {
                        message.mediaUrls = message.mediaUrl ? [message.mediaUrl] : [];
                     }

                     return message as Message;
                  })
                  .filter((msg) => !currentUid || !msg.deletedFor || !msg.deletedFor.includes(currentUid));
            
            setMessages(msgs);
            setHasMore(msgs.length === limitAmount);
            setError(null);
            setLoading(false);
            if (process.env.NODE_ENV === "development") {
               console.log(`Chat: Messages listener active for ${conversationId}`, msgs.length);
            }
         },
         (err) => {
            console.error("Error fetching messages:", err);
            setError(err);
            setLoading(false);
         }
      );

      return () => {
         unsubscribe();
         if (process.env.NODE_ENV === "development") {
            console.log(`Chat: Messages listener unsubscribed for ${conversationId}`);
         }
      };
   }, [conversationId, auth?.currentUser?.uid, limitAmount, db, isVisible]);

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
