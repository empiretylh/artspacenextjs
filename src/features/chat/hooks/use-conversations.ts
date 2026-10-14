import { useEffect, useState, useCallback, useRef } from "react";
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
import { signInWithCustomToken } from "firebase/auth";
import type { Conversation } from "../types";

export const useConversations = () => {
   const { user, isFirebaseReady, firebaseToken, setFirebaseReady } = useAuth();
   const isVisible = useDocumentVisibility();
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);
   const [isTimedOut, setIsTimedOut] = useState(false);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   const retry = useCallback(async () => {
      setIsTimedOut(false);
      setError(null);
      setLoading(true);
      if (auth && firebaseToken && !auth.currentUser) {
         try {
            await signInWithCustomToken(auth, firebaseToken);
            setFirebaseReady(true);
         } catch (err: any) {
            console.error("Chat retry failed:", err);
            setError(err);
            setLoading(false);
         }
      }
   }, [firebaseToken, setFirebaseReady]);

   // Timeout fallback (8 seconds) if user exists but Firebase credentials stall
   useEffect(() => {
      if (!user?.id || isFirebaseReady) {
         setIsTimedOut(false);
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
         }
         return;
      }

      timeoutRef.current = setTimeout(() => {
         if (!isFirebaseReady) {
            setIsTimedOut(true);
            setLoading(false);
            setError(new Error("Unable to connect to chat service. Please check your connection."));
         }
      }, 8000);

      return () => {
         if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = null;
         }
      };
   }, [user?.id, isFirebaseReady]);

   useEffect(() => {
      // If user is completely unauthenticated
      if (!user?.id) {
         setLoading(false);
         setConversations([]);
         return;
      }

      // If document hidden or waiting for Firebase credentials to settle
      if (!db || !isVisible || !isFirebaseReady || !auth?.currentUser) {
         return;
      }

      setLoading(true);

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
   }, [user?.id, isVisible, isFirebaseReady]);

   return { conversations, loading, error, isTimedOut, retry };
};
