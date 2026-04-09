// components/chat/chat-messages.tsx
"use client";

import { useEffect, useRef } from "react";
import { ChatMessageBubble } from "./chat-message-bubble";
import { useAuth } from "@/features/auth/store";
import type { Message } from "../types";

type Props = {
   messages: Message[];
};

export const ChatMessages = ({ messages }: Props) => {
   const { user } = useAuth();
   const bottomRef = useRef<HTMLDivElement | null>(null);

   useEffect(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
   }, [messages]);

   return (
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-4">
         {messages.map((msg) => (
            <ChatMessageBubble
               key={msg.id}
               message={msg}
               isMine={msg.senderId === String(user?.id)}
            />
         ))}
         <div ref={bottomRef} />
      </div>
   );
};
