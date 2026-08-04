// components/chat/chat-messages.tsx
"use client";

import { useEffect, useRef } from "react";
import { ChatMessageBubble } from "./chat-message-bubble";
import { useAuth } from "@/features/auth/store";
import type { Message, ChatUser } from "../types";
import { Loader2 } from "lucide-react";

type Props = {
   conversationId: string | null;
   messages: Message[];
   hasMore: boolean;
   onLoadMore: () => void;
   loading: boolean;
   participantDetails?: Record<string, ChatUser>;
};

export const ChatMessages = ({ conversationId, messages, hasMore, onLoadMore, loading, participantDetails }: Props) => {
   const { user } = useAuth();
   const scrollContainerRef = useRef<HTMLDivElement | null>(null);
   const topSentinelRef = useRef<HTMLDivElement | null>(null);

   // 1. Automated Pagination Trigger
   useEffect(() => {
      if (!hasMore || loading) return;

      const observer = new IntersectionObserver(
         (entries) => {
            // Trigger load more when sentinel is visible
            if (entries[0].isIntersecting) {
               onLoadMore();
            }
         },
         { threshold: 0.1 }
      );

      if (topSentinelRef.current) {
         observer.observe(topSentinelRef.current);
      }

      return () => observer.disconnect();
   }, [hasMore, loading, onLoadMore]);

   return (
      <div 
         ref={scrollContainerRef}
         className="flex flex-1 flex-col-reverse overflow-y-auto p-3 gap-y-2"
      >
         {/* 
            Native scroll behavior with flex-col-reverse:
            - Content starts at the bottom.
            - Scroll position is anchored to the bottom.
            - Older messages (at the end of the array) appear at the top.
         */}
         
         {/* Visual Bottom Gap */}
         <div className="h-2 shrink-0" />

         {messages.map((msg) => (
            <ChatMessageBubble
               key={msg.id}
               message={msg}
               isMine={msg.senderId === String(user?.id)}
               conversationId={conversationId}
               participantDetails={participantDetails}
            />
         ))}

         {/* Load More Sentinel - Visual Top of Chat */}
         <div ref={topSentinelRef} className="h-4 w-full shrink-0">
            {hasMore && loading && (
               <div className="flex justify-center py-2">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
               </div>
            )}
         </div>
      </div>
   );
};
