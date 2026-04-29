import { useMemo } from "react";
import { useAuth } from "@/features/auth/store";
import { useConversations } from "./use-conversations";

export const useUnreadCount = () => {
   const { user } = useAuth();
   const { conversations, loading } = useConversations();

   const totalUnreadCount = useMemo(() => {
      if (!user?.id || !conversations.length) return 0;

      return conversations.reduce((total, conv) => {
         const count = conv.unreadCount?.[user.id] || 0;
         return total + count;
      }, 0);
   }, [user?.id, conversations]);

   return { 
      count: totalUnreadCount, 
      hasUnread: totalUnreadCount > 0,
      loading 
   };
};
