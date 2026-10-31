// components/chat/chat-list-item.tsx
"use client";

import { cn, getImage, getUserDisplayName } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/store";
import { useUserStatus } from "../hooks/use-user-status";
import type { Conversation } from "../types";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";

type Props = {
   conversation: Conversation;
   isActive: boolean;
   onClick: () => void;
};

export const ChatListItem = ({ conversation, isActive, onClick }: Props) => {
   const { user: currentUser } = useAuth();
   const queryClient = useQueryClient();

   // Find the other participant
   const otherUserId = conversation.participants.find(
      (id) => id !== String(currentUser?.id)
   );
   const otherUser = otherUserId ? conversation.participantDetails[otherUserId] : null;
   const { isOnline } = useUserStatus(otherUserId || null);
   const unreadCount = conversation.unreadCount?.[String(currentUser?.id)] || 0;

   // Check React Query cache for fresh user data without triggering network requests
   const cachedUser = otherUserId
      ? (queryClient.getQueryData(queryKeys.user.publicProfile(otherUserId)) as any)
      : null;

   const displayName = cachedUser
      ? getUserDisplayName(cachedUser, cachedUser.email)
      : (otherUser?.name || "User");

   const displayAvatar = cachedUser?.profile?.profile_picture ?? otherUser?.avatar ?? null;

   if (!otherUser) return null;

   return (
      <button
         onClick={onClick}
         className={cn(
            "flex w-full items-center gap-2.5 border-b border-border py-2 pr-4 text-left transition-all duration-200",
            isActive 
               ? "bg-muted/65 border-l-[3px] border-l-primary pl-[13px]" 
               : "hover:bg-muted/40 border-l-[3px] border-l-transparent pl-[13px]"
         )}
      >
         <div className="relative">
            <Avatar className="border border-border/60">
               <AvatarImage src={getImage(displayAvatar)} alt={displayName} />
               <AvatarFallback className="font-display font-semibold bg-primary/5 text-primary text-xs">
                  {displayName[0] || "?"}
               </AvatarFallback>
            </Avatar>
            <span 
               className={cn(
                  "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                  isOnline ? "bg-success" : "bg-muted-foreground/30"
               )} 
            />
         </div>
 
         <div className="min-w-0 flex-1">
            <p className={cn(
               "truncate text-sm font-semibold font-display tracking-tight text-foreground/90",
               unreadCount > 0 && "text-foreground font-bold"
            )}>
               {displayName}
            </p>
            <p className={cn(
               "truncate text-xs text-muted-foreground/80 mt-0.5",
               unreadCount > 0 && "text-primary font-medium"
            )}>
               {conversation.lastMessage || "No messages yet"}
            </p>
         </div>
 
         {unreadCount > 0 && (
            <Badge 
               variant="default" 
               className="h-5 min-w-[20px] justify-center px-1 text-[10px] bg-primary text-primary-foreground hover:bg-primary rounded-full font-semibold border-none shadow-none"
            >
               {unreadCount}
            </Badge>
         )}
      </button>
   );
};
