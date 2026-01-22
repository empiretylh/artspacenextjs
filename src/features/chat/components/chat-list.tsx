// components/chat/chat-list.tsx
import { conversations } from "../dummy-data";
import { ChatListItem } from "./chat-list-item";

type Props = {
   activeId: string | null;
   onSelect: (id: string) => void;
};

export const ChatList = ({ activeId, onSelect }: Props) => {
   return (
      <div className="flex h-full flex-col">
         <div className="border-b p-4">
            <h2 className="text-sm font-semibold">Messages</h2>
         </div>

         <div className="flex-1 overflow-y-auto">
            {conversations.map((conv) => (
               <ChatListItem
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeId}
                  onClick={() => onSelect(conv.id)}
               />
            ))}
         </div>
      </div>
   );
};
