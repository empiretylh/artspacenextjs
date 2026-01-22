// components/chat/chat-layout.tsx
"use client";

import { useState } from "react";
import { ChatList } from "./chat-list";
import { ChatWindow } from "./chat-window";

export const ChatLayout = () => {
   const [activeConversationId, setActiveConversationId] = useState<
      string | null
   >(null);

   return (
      <div className="relative flex h-full w-full overflow-hidden rounded-lg border bg-card">
         {/* Chat List */}
         <div
            className={`
          w-full
          border-r
          bg-background
          md:w-1/3
          ${activeConversationId ? "hidden md:block" : "block"}
        `}
         >
            <ChatList
               activeId={activeConversationId}
               onSelect={setActiveConversationId}
            />
         </div>

         {/* Chat Window */}
         <div
            className={`
          flex flex-1 flex-col
          ${!activeConversationId ? "hidden md:flex" : "flex"}
        `}
         >
            <ChatWindow
               conversationId={activeConversationId}
               onBack={() => setActiveConversationId(null)}
            />
         </div>
      </div>
   );
};
