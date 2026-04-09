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
            "flex max-w-[75%] flex-col rounded-lg px-3 py-2 text-sm",
            isMine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
         )}
      >
         <p className="whitespace-pre-wrap break-words">{message.content}</p>
         <span className="mt-1 text-[10px] opacity-70 text-right">
            {dateLabel}
         </span>
      </div>
   );
};
