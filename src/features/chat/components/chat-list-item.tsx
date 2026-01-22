// components/chat/chat-list-item.tsx
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

type Props = {
   conversation: {
      id: string;
      user: { name: string };
      lastMessage: string;
      unreadCount: number;
      isOnline: boolean;
   };
   isActive: boolean;
   onClick: () => void;
};

export const ChatListItem = ({ conversation, isActive, onClick }: Props) => {
   return (
      <button
         onClick={onClick}
         className={cn(
            "flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors",
            isActive ? "bg-muted" : "hover:bg-muted/50"
         )}
      >
         <div className="relative">
            <Avatar>
               <AvatarFallback>{conversation.user.name[0]}</AvatarFallback>
            </Avatar>

            {conversation.isOnline && (
               <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-success ring-2 ring-background" />
            )}
         </div>

         <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
               {conversation.user.name}
            </p>
            <p className="truncate text-xs text-muted-foreground">
               {conversation.lastMessage}
            </p>
         </div>

         {conversation.unreadCount > 0 && (
            <Badge variant="default">{conversation.unreadCount}</Badge>
         )}
      </button>
   );
};
