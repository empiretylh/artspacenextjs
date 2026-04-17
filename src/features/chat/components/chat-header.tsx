// components/chat/chat-header.tsx
"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ChatUser } from "../types";
import { cn, getImage } from "@/lib/utils";
import { useUserStatus } from "../hooks/use-user-status";
import { useTypingIndicator } from "../hooks/use-typing-indicator";

type Props = {
   conversationId: string | null;
   user: ChatUser;
   onBack: () => void;
};

export const ChatHeader = ({ conversationId, user, onBack }: Props) => {
   const { status, isOnline } = useUserStatus(user.id);
   const { isOtherTyping } = useTypingIndicator(conversationId);
   
   return (
      <div className="flex items-center gap-3 border-b p-4">
         <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onBack}
         >
            <ArrowLeft className="h-4 w-4" />
         </Button>
 
         <div className="relative">
            <Avatar>
               <AvatarImage src={getImage(user.avatar)} alt={user.name} />
               <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <span 
               className={cn(
                  "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background",
                  isOnline ? "bg-green-500" : "bg-gray-400"
               )} 
            />
         </div>
 
         <div>
            <p className="text-sm font-medium">{user.name}</p>
            <p className="text-xs text-muted-foreground">
               {isOtherTyping ? (
                  <span className="text-primary font-medium animate-pulse">Typing...</span>
               ) : (
                  status
               )}
            </p>
         </div>
      </div>
   );
};
