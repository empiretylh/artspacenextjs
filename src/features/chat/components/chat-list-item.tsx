// components/chat/chat-list-item.tsx
"use client";

import { cn, getImage } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/store";
import { useUserStatus } from "../hooks/use-user-status";
import type { Conversation } from "../types";

type Props = {
   conversation: Conversation;
   isActive: boolean;
   onClick: () => void;
};

export const ChatListItem = ({ conversation, isActive, onClick }: Props) => {
   const { user: currentUser } = useAuth();

   // Find the other participant
   const otherUserId = conversation.participants.find(
      (id) => id !== String(currentUser?.id)
   );
   const otherUser = otherUserId ? conversation.participantDetails[otherUserId] : null;
   const { isOnline } = useUserStatus(otherUserId || null);

   if (!otherUser) return null;

   return (
      <button
         onClick={onClick}
         className={cn(
            "flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors",
            isActive ? "bg-muted" : "hover:bg-muted/50"
         )}
      >
         <div className="relative">
            <Avatar>
               <AvatarImage src={getImage(otherUser.avatar)} alt={otherUser.name} />
               <AvatarFallback>{otherUser.name[0]}</AvatarFallback>
            </Avatar>
            <span 
               className={cn(
                  "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                  isOnline ? "bg-green-500" : "bg-gray-400"
               )} 
            />
         </div>

         <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
               {otherUser.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
               {conversation.lastMessage || "No messages yet"}
            </p>
         </div>

         {/* unreadCount placeholder */}
         {/* {conversation.unreadCount > 0 && (
            <Badge variant="default">{conversation.unreadCount}</Badge>
         )} */}
      </button>
   );
};
