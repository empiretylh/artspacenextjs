// components/chat/chat-message-bubble.tsx
import { cn } from "@/lib/utils";
import type { Message } from "../dummy-data";

type Props = {
   message: Message;
   isMine: boolean;
};

export const ChatMessageBubble = ({ message, isMine }: Props) => {
   return (
      <div
         className={cn(
            "flex max-w-[75%] flex-col rounded-lg px-3 py-2 text-sm",
            isMine ? "ml-auto bg-primary text-primary-foreground" : "bg-muted"
         )}
      >
         <p>{message.content}</p>
         <span className="mt-1 text-xs opacity-70">{message.createdAt}</span>
      </div>
   );
};
