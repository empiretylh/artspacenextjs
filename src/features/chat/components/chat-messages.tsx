// components/chat/chat-messages.tsx
import type { Message } from "../dummy-data";
import { ChatMessageBubble } from "./chat-message-bubble";
import { useEffect, useRef } from "react";

type Props = {
   messages: Message[];
};

export const ChatMessages = ({ messages }: Props) => {
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
               isMine={msg.senderId === "me"}
            />
         ))}
         <div ref={bottomRef} />
      </div>
   );
};
