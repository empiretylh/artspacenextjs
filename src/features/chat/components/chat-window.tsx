// components/chat/chat-window.tsx
import { useState } from "react";
import { messages as initialMessages, users } from "../dummy-data";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";
import { ChatInput } from "./chat-input";

type Props = {
   conversationId: string | null;
   onBack: () => void;
};

export const ChatWindow = ({ conversationId, onBack }: Props) => {
   const [messages, setMessages] = useState(initialMessages);

   if (!conversationId) {
      return (
         <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Select a conversation
         </div>
      );
   }

   return (
      <>
         <ChatHeader user={users[0]} onBack={onBack} />
         <ChatMessages messages={messages} />
         <ChatInput
            onSend={(text) =>
               setMessages((prev) => [
                  ...prev,
                  {
                     id: crypto.randomUUID(),
                     senderId: "me",
                     content: text,
                     createdAt: "Now",
                  },
               ])
            }
         />
      </>
   );
};
