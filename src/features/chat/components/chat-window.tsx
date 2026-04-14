// components/chat/chat-window.tsx
"use client";

import { useMessages } from "../hooks/use-messages";
import { useSendMessage } from "../hooks/use-send-message";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";
import { useConversations } from "../hooks/use-conversations";
import { useAuth } from "@/features/auth/store";
import { Loader2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getUserQueryOptions } from "@/features/service/artspace/get-user";
import { UserRouteType } from "@/features/service/artspace/get-users";
import { useMarkRead } from "../hooks/use-mark-read";
import type { ChatUser } from "../types";
import { useEffect } from "react";

type Props = {
   conversationId: string | null;
   recipientId?: string | null;
   userType?: UserRouteType | null;
   onBack: () => void;
};

export const ChatWindow = ({ conversationId, recipientId, userType = "artists", onBack }: Props) => {
   const { user: currentUser } = useAuth();
   const { conversations } = useConversations();
   const { markAsRead } = useMarkRead();
   const { messages, loading: messagesLoading, hasMore, loadMore } = useMessages(conversationId);
   const { sendMessage } = useSendMessage(conversationId);

   // Fetch recipient data for new chats
   const { data: recipientData, isLoading: recipientLoading } = useQuery({
      ...getUserQueryOptions(recipientId || "", userType || "artists"),
      enabled: !!recipientId && !conversationId,
   });

   const activeConversation = conversations.find((c) => c.id === conversationId);
   
   let displayUser: ChatUser | null = null;

   if (activeConversation) {
      const otherUserId = activeConversation.participants.find(
         (id) => id !== String(currentUser?.id)
      );
      displayUser = otherUserId ? activeConversation.participantDetails[otherUserId] : null;
   }

   const recipientUser: ChatUser | null = recipientData ? {
      id: String((recipientData as any).id),
      name: `${(recipientData as any).first_name || ""} ${(recipientData as any).last_name || ""}`.trim() || (recipientData as any).email,
      avatar: (recipientData as any).profile?.profile_picture || null
   } : null;

   const finalUser = displayUser || recipientUser;
   const currentUnreadCount = activeConversation?.unreadCount?.[String(currentUser?.id)] || 0;

   // Mark as read when conversation becomes active or messages arrive
   useEffect(() => {
      if (conversationId && currentUnreadCount > 0) {
         markAsRead(conversationId);
      }
   }, [conversationId, currentUnreadCount, markAsRead]);

   if (!conversationId && !recipientId) {
      return (
         <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation
         </div>
      );
   }

   if (recipientLoading) {
      return (
         <div className="flex h-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground/40" />
         </div>
      );
   }

   return (
      <div className="flex h-full flex-col">
         {finalUser && <ChatHeader user={finalUser} onBack={onBack} />}
         
         <div className="flex-1 min-h-0 flex flex-col">
            {messagesLoading && messages.length === 0 ? (
               <div className="flex h-full items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground/40" />
               </div>
            ) : (
               <ChatMessages 
                  conversationId={conversationId}
                  messages={messages} 
                  hasMore={hasMore} 
                  onLoadMore={loadMore} 
                  loading={messagesLoading}
               />
            )}
         </div>

         <ChatInput 
            onSend={async (text) => {
               await sendMessage(text, recipientUser || undefined);
            }} 
         />
      </div>
   );
};
