"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import type { UserDocument } from "../types";
import { formatDistanceToNow } from "date-fns";

/**
 * Hook to listen for a specific user's online status in real-time.
 */
export const useUserStatus = (userId: string | null) => {
   const [data, setData] = useState<{ status: string; isOnline: boolean }>({
      status: "Offline",
      isOnline: false,
   });

   useEffect(() => {
      if (!userId || !db) return;

      const userRef = doc(db, "users", userId);

      const unsubscribe = onSnapshot(userRef, (docSnap) => {
         if (docSnap.exists()) {
            const userData = docSnap.data() as UserDocument;
            
            if (userData.lastSeen) {
               const lastSeenDate = userData.lastSeen.toDate();
               const diffInMinutes = (Date.now() - lastSeenDate.getTime()) / 1000 / 60;
               const isOnline = diffInMinutes < 3;

               setData({
                  isOnline,
                  status: isOnline 
                     ? "Active now" 
                     : `Active ${formatDistanceToNow(lastSeenDate)} ago`
               });
            } else {
               setData({ status: "Offline", isOnline: false });
            }
         } else {
            setData({ status: "Offline", isOnline: false });
         }
      }, (error) => {
         console.error("Error listening to user status:", error);
         setData({ status: "Offline", isOnline: false });
      });

      return () => unsubscribe();
   }, [userId]);

   return data;
};
