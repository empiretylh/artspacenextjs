import { useEffect, useState } from "react";
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
import type { Conversation } from "../types";

export const useConversations = () => {
   const { user } = useAuth();
   const [conversations, setConversations] = useState<Conversation[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<Error | null>(null);

   useEffect(() => {
      // 1. Wait for both our store user AND Firebase Auth user to be ready
      // This prevents "Missing or insufficient permissions" errors on login/logout
      if (!user?.id || !db || !auth?.currentUser) {
         setLoading(!!user?.id); // Keep loading if we have a user but Firebase isn't ready
         setConversations([]);
         return;
      }

      // 2. Optional: Verify that Firebase Auth UID matches our user ID
      // (Safety check for multi-account environments)
      if (auth.currentUser.uid !== String(user.id)) {
         return;
      }

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
         },
         (err) => {
            console.error("Error fetching conversations:", err);
            setError(err);
            setLoading(false);
         }
      );

      return () => unsubscribe();
   }, [user?.id, auth?.currentUser?.uid]);

   return { conversations, loading, error };
};
