"use client";

import { useEffect, useRef } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { env } from "@/config/env";

/**
 * Hook to manage user presence by updating current user's lastSeen field in Firestore.
 * This runs as long as the user is authenticated and the component is mounted.
 */
export const usePresence = () => {
   const { user } = useAuth();
   const intervalRef = useRef<NodeJS.Timeout | null>(null);

   useEffect(() => {
      // Only run if feature is enabled and user is logged in
      if (!env.FIREBASE_ENABLE || !user?.id || !db) {
         return;
      }

      const userIdStr = String(user.id);
      const userRef = doc(db, "users", userIdStr);

      const updateLastSeen = async () => {
         try {
            await setDoc(userRef, {
               lastSeen: serverTimestamp(),
               updatedAt: serverTimestamp(),
            }, { merge: true });
            if (env.NODE_ENV === "development") {
               console.log("Presence: Updated lastSeen for user", userIdStr);
            }
         } catch (error) {
            console.error("Presence: Failed to update lastSeen:", error);
         }
      };

      // Initial update
      updateLastSeen();

      // Periodic update every 60 seconds
      intervalRef.current = setInterval(updateLastSeen, 60000);

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
         }
      };
   }, [user?.id]);
};
