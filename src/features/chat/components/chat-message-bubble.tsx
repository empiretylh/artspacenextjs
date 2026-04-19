// components/chat/chat-message-bubble.tsx
"use client";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Message } from "../types";

type Props = {
   message: Message;
   isMine: boolean;
};

export const ChatMessageBubble = ({ message, isMine }: Props) => {
   const dateLabel = message.createdAt?.toDate?.() 
      ? format(message.createdAt.toDate(), "HH:mm")
      : "Sending...";

   return (
      <div
         className={cn(
            "flex max-w-[80%] flex-col rounded-2xl px-4 py-2 text-sm shadow-sm",
            isMine 
               ? "ml-auto bg-primary text-primary-foreground rounded-tr-none mr-1" 
               : "bg-muted rounded-tl-none mr-auto ml-1"
         )}
      >
         <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
         <span className={cn(
            "mt-1 text-[10px] opacity-60",
            isMine ? "text-right" : "text-left"
         )}>
            {dateLabel}
         </span>
      </div>
   );
};
