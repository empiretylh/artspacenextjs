import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Message, ChatUser } from "../types";
import { getImage } from "@/lib/utils";
import { MediaLightbox } from "./media-lightbox";
import { Smile } from "lucide-react";
import { useToggleReaction } from "../hooks/use-toggle-reaction";
import { MessageReactions } from "./message-reactions";
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import { useAuth } from "@/features/auth/store";

type Props = {
   message: Message;
   isMine: boolean;
   conversationId: string | null;
   participantDetails?: Record<string, ChatUser>;
};

const EMOJIS = ["👍", "❤️", "🥰", "😆", "😮", "😢", "😡"];

const MessageGallery = ({ 
   urls, 
   caption, 
   onImageClick 
}: { 
   urls: string[]; 
   caption?: string;
   onImageClick: (e: React.MouseEvent, index: number) => void;
}) => {
   const count = urls.length;
   
   if (count === 0) return null;

   if (count === 1) {
      return (
         <img 
            src={getImage(urls[0])} 
            alt={caption || "Chat image"} 
            className="max-h-[400px] w-full object-contain bg-background/5 cursor-pointer hover:opacity-95 transition-opacity"
            loading="lazy"
            onClick={(e) => onImageClick(e, 0)}
         />
      );
   }

   // Gallery layouts
   const displayUrls = urls.slice(0, 4);
   const remaining = count - 4;

   return (
      <div className={cn(
         "grid gap-0.5 w-full",
         count === 2 ? "grid-cols-2" : "grid-cols-2" // Default to 2 cols for batch
      )}>
         {displayUrls.map((url, i) => {
            // Special layout for 3 images: 1st spans 2 cols
            const isFirstOfThree = count === 3 && i === 0;
            return (
               <div 
                  key={url} 
                  className={cn(
                     "relative bg-background/5 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity",
                     isFirstOfThree ? "col-span-2 aspect-video" : "aspect-square"
                  )}
                  onClick={(e) => onImageClick(e, i)}
               >
                  <img 
                     src={getImage(url)} 
                     alt={`Gallery ${i + 1}`} 
                     className="w-full h-full object-cover"
                     loading="lazy"
                  />
                  {i === 3 && remaining > 0 && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold backdrop-blur-[2px]">
                        +{remaining}
                     </div>
                  )}
               </div>
            );
         })}
      </div>
   );
};

export const ChatMessageBubble = ({ message, isMine, conversationId, participantDetails }: Props) => {
   const { user } = useAuth();
   const { toggleReaction } = useToggleReaction(conversationId);
   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(0);
   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

   const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const isLongPressRef = useRef(false);

   const handleTouchStart = () => {
      isLongPressRef.current = false;
      touchTimeoutRef.current = setTimeout(() => {
         setIsPopoverOpen(true);
         isLongPressRef.current = true;
         if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
            window.navigator.vibrate(50);
         }
      }, 500);
   };

   const handleTouchEnd = (e: React.TouchEvent) => {
      if (touchTimeoutRef.current) {
         clearTimeout(touchTimeoutRef.current);
      }
      if (isLongPressRef.current) {
         e.preventDefault();
         e.stopPropagation();
      }
   };

   const handleTouchMove = () => {
      if (touchTimeoutRef.current) {
         clearTimeout(touchTimeoutRef.current);
      }
   };

   const dateLabel = message.createdAt?.toDate?.() 
      ? format(message.createdAt.toDate(), "h:mm a")
      : "Sending...";
      
   const handleImageClick = (e: React.MouseEvent, index: number) => {
      e.stopPropagation();
      setActiveIndex(index);
      setIsLightboxOpen(true);
   };

   return (
      <div className={cn("flex w-full items-center gap-1.5 group relative", isMine ? "justify-end" : "justify-start")}>
         {/* Reaction Popover */}
         <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
               <button 
                  className={cn(
                     "hidden md:flex opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer",
                     isMine ? "order-first" : "order-last"
                  )}
                  aria-label="Add reaction"
               >
                  <Smile className="h-4 w-4" />
               </button>
            </PopoverTrigger>

            <PopoverAnchor asChild>
               <div
                  onTouchStart={handleTouchStart}
                  onTouchEnd={handleTouchEnd}
                  onTouchMove={handleTouchMove}
                  className={cn(
                     "flex max-w-[80%] flex-col rounded-2xl shadow-xs border relative select-none",
                     isMine 
                        ? "bg-primary text-primary-foreground border-primary/10 rounded-tr-none order-last" 
                        : "bg-muted/30 text-foreground border-border rounded-tl-none order-first",
                     message.type === 'image' ? "p-1.5" : "px-3 py-1.5"
                  )}
               >
                  {message.type === 'image' ? (
                     <div className="flex flex-col overflow-hidden rounded-xl">
                        <MessageGallery 
                           urls={message.mediaUrls} 
                           caption={message.content} 
                           onImageClick={handleImageClick}
                        />
                        {message.content && message.content !== "Sent images" && message.content !== "Sent an image" && (
                           <p className="px-3 pt-2 pb-1 text-sm whitespace-pre-wrap break-words leading-relaxed font-sans">
                              {message.content}
                           </p>
                        )}
                     </div>
                  ) : (
                     <p className="whitespace-pre-wrap break-words text-sm leading-relaxed font-sans">
                        {message.content}
                     </p>
                  )}
                  
                  <span className={cn(
                     "mt-0.5 text-[10px] opacity-70 font-sans tracking-wide",
                     message.type === 'image' ? "px-2 pb-1" : "",
                     isMine ? "text-right text-primary-foreground/80" : "text-left text-muted-foreground"
                  )}>
                     {dateLabel}
                  </span>

                  <MessageReactions 
                     message={message} 
                     participantDetails={participantDetails} 
                     isMine={isMine}
                     onReact={(emoji) => toggleReaction(message, emoji)} 
                  />
               </div>
            </PopoverAnchor>

            <PopoverContent 
               side="top" 
               align={isMine ? "end" : "start"} 
               className="w-auto p-1 rounded-full flex gap-0.5 bg-background/95 backdrop-blur-md shadow-md border animate-in fade-in-50 slide-in-from-bottom-1 z-50"
            >
               {EMOJIS.map((emoji) => {
                  const hasReacted = message.reactions?.[String(user?.id)] === emoji;
                  return (
                     <button
                        key={emoji}
                        onClick={(e) => {
                           e.stopPropagation();
                           toggleReaction(message, emoji);
                           setIsPopoverOpen(false);
                        }}
                        className={cn(
                           "hover:scale-125 hover:bg-muted active:scale-95 transition-all p-1.5 rounded-full text-base leading-none cursor-pointer",
                           hasReacted && "bg-primary/10"
                        )}
                     >
                        {emoji}
                     </button>
                  );
               })}
            </PopoverContent>
         </Popover>

         {message.type === 'image' && (
            <MediaLightbox 
               urls={message.mediaUrls}
               initialIndex={activeIndex}
               isOpen={isLightboxOpen}
               onClose={() => setIsLightboxOpen(false)}
            />
         )}
      </div>
   );
};
