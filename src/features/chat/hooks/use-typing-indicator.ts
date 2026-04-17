import { useEffect, useState, useRef } from "react";
import { 
   doc, 
   onSnapshot, 
   updateDoc, 
   serverTimestamp,
   Timestamp
} from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { Conversation } from "../types";

const TYPING_TIMEOUT = 3000; // 3 seconds of silence stops typing
const STALE_TIMEOUT = 5000;  // 5 seconds old timestamp is considered stale
const THROTTLE_INTERVAL = 2000; // Only update Firestore once every 2 seconds

export const useTypingIndicator = (conversationId: string | null) => {
   const { user } = useAuth();
   const [isOtherTyping, setIsOtherTyping] = useState(false);
   const lastUpdateRef = useRef<number>(0);
   const timeoutRef = useRef<NodeJS.Timeout | null>(null);

   // 1. Recipient side: Listen to the conversation document
   useEffect(() => {
      if (!conversationId || !db || !user?.id) return;

      const convRef = doc(db, "conversations", conversationId);
      const unsubscribe = onSnapshot(convRef, (snapshot) => {
         const data = snapshot.data() as Conversation;
         if (!data?.typing) {
            setIsOtherTyping(false);
            return;
         }

         // Find other participants who are typing
         const now = Date.now();
         const otherTyping = Object.entries(data.typing).some(([uid, timestamp]) => {
            if (uid === String(user.id)) return false;
            if (!timestamp) return false;
            
            // Convert Firestore Timestamp to JS Date
            const lastActive = timestamp.toMillis();
            return (now - lastActive) < STALE_TIMEOUT;
         });

         setIsOtherTyping(otherTyping);
      });

      return () => unsubscribe();
   }, [conversationId, user?.id]);

   // 2. Sender side: Function to update my typing status
   const setTyping = async (typing: boolean) => {
      if (!conversationId || !db || !user?.id) return;

      // Logic for stopping typing
      if (!typing) {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
         const convRef = doc(db, "conversations", conversationId);
         await updateDoc(convRef, {
            [`typing.${user.id}`]: null
         });
         return;
      }

      // Logic for active typing (throttled)
      const now = Date.now();
      if (now - lastUpdateRef.current > THROTTLE_INTERVAL) {
         lastUpdateRef.current = now;
         const convRef = doc(db, "conversations", conversationId);
         await updateDoc(convRef, {
            [`typing.${user.id}`]: serverTimestamp()
         });
      }

      // Reset auto-stop timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
         setTyping(false);
      }, TYPING_TIMEOUT);
   };

   // Cleanup on unmount
   useEffect(() => {
      return () => {
         if (timeoutRef.current) clearTimeout(timeoutRef.current);
      };
   }, []);

   return { isOtherTyping, setTyping };
};
