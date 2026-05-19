import { useState } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Message } from "../types";
import { getImage } from "@/lib/utils";
import { MediaLightbox } from "./media-lightbox";

type Props = {
   message: Message;
   isMine: boolean;
};

const MessageGallery = ({ 
   urls, 
   caption, 
   onImageClick 
}: { 
   urls: string[]; 
   caption?: string;
   onImageClick: (index: number) => void;
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
            onClick={() => onImageClick(0)}
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
                  onClick={() => onImageClick(i)}
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

export const ChatMessageBubble = ({ message, isMine }: Props) => {
   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(0);

   const dateLabel = message.createdAt?.toDate?.() 
      ? format(message.createdAt.toDate(), "HH:mm")
      : "Sending...";
      
   const handleImageClick = (index: number) => {
      setActiveIndex(index);
      setIsLightboxOpen(true);
   };

   return (
      <div
         className={cn(
            "flex max-w-[80%] flex-col rounded-2xl shadow-sm",
            isMine 
               ? "ml-auto bg-primary text-primary-foreground rounded-tr-none mr-1" 
               : "bg-muted rounded-tl-none mr-auto ml-1",
            message.type === 'image' ? "p-1.5" : "px-4 py-2"
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
                  <p className="px-3 pt-2 pb-1 text-sm whitespace-pre-wrap break-words leading-relaxed">
                     {message.content}
                  </p>
               )}
            </div>
         ) : (
            <p className="whitespace-pre-wrap break-words leading-relaxed px-4 py-2">
               {message.content}
            </p>
         )}
         
         <span className={cn(
            "mt-1 text-[10px] opacity-60",
            message.type === 'image' ? "px-2 pb-1" : "",
            isMine ? "text-right" : "text-left"
         )}>
            {dateLabel}
         </span>

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
