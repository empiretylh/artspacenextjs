// components/chat/chat-input.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useTypingIndicator } from "../hooks/use-typing-indicator";

type Props = {
   conversationId: string | null;
   onSend: (message: string) => void;
};

export const ChatInput = ({ conversationId, onSend }: Props) => {
   const [value, setValue] = useState("");
   const { setTyping } = useTypingIndicator(conversationId);

   const handleSend = () => {
      if (!value.trim()) return;
      onSend(value);
      setValue("");
      setTyping(false); // Explicitly stop typing immediately on send
   };

   return (
      <div className="border-t bg-background p-3">
         <div className="flex items-end gap-2">
            <Textarea
               value={value}
               onChange={(e) => {
                  setValue(e.target.value);
                  setTyping(true);
               }}
               placeholder="Type a message..."
               rows={1}
               className="resize-none"
               onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                     e.preventDefault();
                     handleSend();
                  }
               }}
            />

            <Button size="icon" disabled={!value.trim()} onClick={handleSend}>
               <Send className="h-4 w-4" />
            </Button>
         </div>
      </div>
   );
};
