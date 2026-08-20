import { useMemo, useEffect } from "react";
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

   // Sync with PWA App Badge
   useEffect(() => {
      if (typeof navigator === "undefined" || !('setAppBadge' in navigator)) return;

      if (totalUnreadCount > 0) {
         navigator.setAppBadge(totalUnreadCount).catch((error) => {
            console.error('Error setting app badge:', error);
         });
      } else {
         navigator.clearAppBadge().catch((error) => {
            console.error('Error clearing app badge:', error);
         });
      }
   }, [totalUnreadCount]);

   return { 
      count: totalUnreadCount, 
      hasUnread: totalUnreadCount > 0,
      loading 
   };
};
