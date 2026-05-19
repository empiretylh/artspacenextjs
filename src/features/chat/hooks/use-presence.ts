"use client";

import { useEffect, useRef } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { env } from "@/config/env";
import { useDocumentVisibility } from "@/hooks/use-document-visibility";

/**
 * Hook to manage user presence by updating current user's lastSeen field in Firestore.
 * This runs as long as the user is authenticated and the component is mounted.
 * Optimization: Only updates when the document is visible.
 */
export const usePresence = () => {
   const { user } = useAuth();
   const isVisible = useDocumentVisibility();
   const intervalRef = useRef<NodeJS.Timeout | null>(null);
   const lastUpdateRef = useRef<number>(0);

   useEffect(() => {
      // Only run if feature is enabled, user is logged in, and tab is visible
      if (!env.FIREBASE_ENABLE || !user?.id || !db || !isVisible) {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
         return;
      }

      const userIdStr = String(user.id);
      const userRef = doc(db, "users", userIdStr);

      const updateLastSeen = async () => {
         const now = Date.now();
         // Throttle: don't update more than once every 60 seconds
         // except for the very first mount or becoming visible after a long time
         if (now - lastUpdateRef.current < 60000 && lastUpdateRef.current !== 0) {
            return;
         }

         try {
            lastUpdateRef.current = now;
            await setDoc(userRef, {
               lastSeen: serverTimestamp(),
               updatedAt: serverTimestamp(),
            }, { merge: true });
            
            if (process.env.NODE_ENV === "development") {
               console.log("Presence: Updated lastSeen for user", userIdStr);
            }
         } catch (error) {
            console.error("Presence: Failed to update lastSeen:", error);
         }
      };

      // Initial update when becoming visible (throttled inside updateLastSeen)
      updateLastSeen();

      // Periodic update every 60 seconds
      intervalRef.current = setInterval(updateLastSeen, 60000);

      return () => {
         if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
         }
      };
   }, [user?.id, isVisible]);
};
