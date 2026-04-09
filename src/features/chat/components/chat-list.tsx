// components/chat/chat-list.tsx
"use client";

import { useConversations } from "../hooks/use-conversations";
import { ChatListItem } from "./chat-list-item";
import { Loader2 } from "lucide-react";

type Props = {
   activeId: string | null;
   onSelect: (id: string) => void;
};

export const ChatList = ({ activeId, onSelect }: Props) => {
   const { conversations, loading } = useConversations();

   return (
      <div className="flex h-full flex-col">
         <div className="border-b p-4">
            <h2 className="text-sm font-semibold">Messages</h2>
         </div>

         <div className="flex-1 overflow-y-auto">
            {loading ? (
               <div className="flex p-4 justify-center">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
               </div>
            ) : conversations.length === 0 ? (
               <div className="p-8 text-center text-xs text-muted-foreground">
                  No conversations yet.
               </div>
            ) : (
               conversations.map((conv) => (
                  <ChatListItem
                     key={conv.id}
                     conversation={conv}
                     isActive={conv.id === activeId}
                     onClick={() => onSelect(conv.id)}
                  />
               ))
            )}
         </div>
      </div>
   );
};
