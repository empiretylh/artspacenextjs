import { doc, setDoc, serverTimestamp, getDocs, collection, query, where, writeBatch, limit } from "firebase/firestore";
import { db } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import type { UserDocument } from "../types";

export const useSyncUserProfile = () => {
   const { user } = useAuth();

   const syncProfile = async (retroactive = false) => {
      if (!user?.id || !db) return;

      const userIdStr = String(user.id);
      const userRef = doc(db, "users", userIdStr);

      const name = `${user.first_name || ""} ${user.last_name || ""}`.trim() || user.email;
      const avatar = user.profile?.profile_picture || null;

      const userData: UserDocument = {
         id: userIdStr,
         name,
         avatar,
         updatedAt: serverTimestamp() as any,
      };

      try {
         // 1. Update/Create User Document
         await setDoc(userRef, userData, { merge: true });

         // 2. Retroactive Sync: Update recent conversations
         if (retroactive) {
            const conversationsRef = collection(db, "conversations");
            const q = query(
               conversationsRef,
               where("participants", "array-contains", userIdStr),
               limit(50) // Safety limit
            );

            const querySnapshot = await getDocs(q);
            if (!querySnapshot.empty) {
               const batch = writeBatch(db);
               
               querySnapshot.docs.forEach((convDoc) => {
                  batch.update(convDoc.ref, {
                     [`participantDetails.${userIdStr}`]: {
                        id: userIdStr,
                        name,
                        avatar
                     },
                     updatedAt: serverTimestamp()
                  });
               });

               await batch.commit();
            }
         }
      } catch (err) {
         console.error("Error syncing user profile to Firestore:", err);
      }
   };

   return { syncProfile };
};
