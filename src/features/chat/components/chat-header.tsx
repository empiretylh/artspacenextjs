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
   onClick?: () => void;
   variant?: "default" | "mini";
};

export const ChatHeader = ({ 
   conversationId, 
   user, 
   onBack, 
   onClick,
   variant = "default"
}: Props) => {
   const { status, isOnline } = useUserStatus(user.id);
   const { isOtherTyping } = useTypingIndicator(conversationId);
   
   return (
      <div className={cn(
         "flex items-center gap-3 border-b border-border bg-background",
         variant === "mini" ? "p-3" : "py-2.5 px-4"
      )}>
         {onBack && (
            <Button
               variant="ghost"
               size="icon"
               className={cn(
                  "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground",
                  variant === "default" && "md:hidden"
               )}
               onClick={onBack}
            >
               <ArrowLeft className="h-4 w-4" />
            </Button>
         )}
 
         <div 
            onClick={onClick}
            className={cn(
               "flex items-center gap-3 px-2 py-1 rounded-xl transition-colors",
               onClick && "hover:bg-muted/50 cursor-pointer active:bg-muted"
            )}
         >
            <div className="relative">
               <Avatar className="border border-border/60">
                  <AvatarImage src={getImage(user.avatar)} alt={user.name} />
                  <AvatarFallback className="font-display font-bold bg-primary/5 text-primary text-xs">{user.name[0]}</AvatarFallback>
               </Avatar>
               <span 
                  className={cn(
                     "absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-background",
                     isOnline ? "bg-success" : "bg-muted-foreground/30"
                  )} 
               />
            </div>
    
            <div>
               <p className="text-sm font-bold font-display tracking-tight text-foreground">{user.name}</p>
               <p className="text-xs text-muted-foreground/80 mt-0.5">
                  {isOtherTyping ? (
                     <span className="text-primary font-medium animate-pulse">Typing...</span>
                  ) : (
                     status
                  )}
               </p>
            </div>
         </div>
      </div>
   );
};
