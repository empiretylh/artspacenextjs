import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Message, ChatUser } from "../types";
import { getImage } from "@/lib/utils";
import { MediaLightbox } from "./media-lightbox";
import { Smile, MoreVertical, Pencil, Trash2, Ban, Check, X, Loader2 } from "lucide-react";
import { useToggleReaction } from "../hooks/use-toggle-reaction";
import { useEditMessage } from "../hooks/use-edit-message";
import { useDeleteMessage } from "../hooks/use-delete-message";
import { MessageReactions } from "./message-reactions";
import { Popover, PopoverTrigger, PopoverContent, PopoverAnchor } from "@/components/ui/popover";
import {
   DropdownMenu,
   DropdownMenuTrigger,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
   AlertDialog,
   AlertDialogContent,
   AlertDialogHeader,
   AlertDialogTitle,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/features/auth/store";
import { ImageReactionsOverlay } from "./image-reactions-overlay";
import { LinkPreviewCard } from "./link-preview-card";
import { renderFormattedMessageText } from "../utils/link-detector";
import { useTranslations } from "next-intl";

type Props = {
   message: Message;
   isMine: boolean;
   conversationId: string | null;
   participantDetails?: Record<string, ChatUser>;
};

const EMOJIS = ["👍", "❤️", "🥰", "😆", "😮", "😢", "😡"];

const MessageGalleryItem = ({
   message,
   url,
   index,
   aspectClass,
   imgClass = "w-full h-full object-cover",
   onImageClick,
   toggleReaction,
   participantDetails
}: {
   message: Message;
   url: string;
   index: number;
   aspectClass: string;
   imgClass?: string;
   onImageClick: (e: React.MouseEvent, index: number) => void;
   toggleReaction: (message: Message, emoji: string, imageIndex?: number) => Promise<void>;
   participantDetails?: Record<string, ChatUser>;
}) => {
   const imageReactions = message.mediaReactions?.[String(index)] || {};
   const hasReactions = Object.keys(imageReactions).length > 0;

   return (
      <div 
         className={cn(
            "relative bg-background/5 overflow-hidden cursor-pointer group/item select-none w-full h-full",
            aspectClass
         )}
         onClick={(e) => onImageClick(e, index)}
      >
         <img 
            src={getImage(url)} 
            alt={`Gallery ${index + 1}`} 
            className={imgClass}
            loading="lazy"
         />

         {/* Existing Reactions Overlay on the image thumbnail */}
         {hasReactions && (
            <div className="absolute bottom-2 left-2 z-10 pointer-events-auto" onClick={(e) => e.stopPropagation()}>
               <ImageReactionsOverlay 
                  reactions={imageReactions}
                  participantDetails={participantDetails}
                  onReact={(emoji) => toggleReaction(message, emoji, index)}
               />
            </div>
         )}
      </div>
   );
};

const MessageGallery = ({ 
   message,
   urls, 
   caption, 
   onImageClick,
   toggleReaction,
   participantDetails
}: { 
   message: Message;
   urls: string[]; 
   caption?: string;
   onImageClick: (e: React.MouseEvent, index: number) => void;
   toggleReaction: (message: Message, emoji: string, imageIndex?: number) => Promise<void>;
   participantDetails?: Record<string, ChatUser>;
}) => {
   const count = urls.length;
   
   if (count === 0) return null;

   if (count === 1) {
      return (
         <MessageGalleryItem
            message={message}
            url={urls[0]}
            index={0}
            aspectClass="max-h-[400px] w-full"
            imgClass="max-h-[400px] w-full object-contain bg-background/5 cursor-pointer hover:opacity-95 transition-opacity"
            onImageClick={onImageClick}
            toggleReaction={toggleReaction}
            participantDetails={participantDetails}
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
                     "relative bg-background/5 overflow-hidden aspect-square w-full h-full",
                     isFirstOfThree ? "col-span-2 aspect-video" : ""
                  )}
               >
                  <MessageGalleryItem
                     message={message}
                     url={url}
                     index={i}
                     aspectClass="w-full h-full"
                     imgClass="w-full h-full object-cover"
                     onImageClick={onImageClick}
                     toggleReaction={toggleReaction}
                     participantDetails={participantDetails}
                  />
                  {i === 3 && remaining > 0 && (
                     <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-lg font-semibold backdrop-blur-[2px] pointer-events-none z-20">
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
   const t = useTranslations("Chat");
   const { user } = useAuth();
   const { toggleReaction } = useToggleReaction(conversationId);
   const { editMessage } = useEditMessage(conversationId);
   const { deleteForEveryone, deleteForMe } = useDeleteMessage(conversationId);

   const [isLightboxOpen, setIsLightboxOpen] = useState(false);
   const [activeIndex, setActiveIndex] = useState(0);
   const [isPopoverOpen, setIsPopoverOpen] = useState(false);

   // Edit State
   const [isEditing, setIsEditing] = useState(false);
   const [editContent, setEditContent] = useState(message.content || "");
   const [isSavingEdit, setIsSavingEdit] = useState(false);

   // Delete State
   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
   const [isDeleting, setIsDeleting] = useState(false);

   const touchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
   const isLongPressRef = useRef(false);

   const handleTouchStart = () => {
      if (message.isDeleted) return;
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

   const handleStartEdit = () => {
      setEditContent(message.content);
      setIsEditing(true);
   };

   const handleCancelEdit = () => {
      setIsEditing(false);
      setEditContent(message.content);
   };

   const handleSaveEdit = async () => {
      if (!editContent.trim() || isSavingEdit) return;
      try {
         setIsSavingEdit(true);
         await editMessage(message, editContent);
         setIsEditing(false);
      } catch (err) {
         console.error("Failed to save edit:", err);
      } finally {
         setIsSavingEdit(false);
      }
   };

   const handleDeleteForEveryone = async () => {
      try {
         setIsDeleting(true);
         await deleteForEveryone(message);
         setIsDeleteDialogOpen(false);
      } catch (err) {
         console.error("Failed to delete for everyone:", err);
      } finally {
         setIsDeleting(false);
      }
   };

   const handleDeleteForMe = async () => {
      try {
         setIsDeleting(true);
         await deleteForMe(message);
         setIsDeleteDialogOpen(false);
      } catch (err) {
         console.error("Failed to delete for me:", err);
      } finally {
         setIsDeleting(false);
      }
   };

   // Render soft-deleted message state
   if (message.isDeleted) {
      return (
         <div className={cn("flex w-full items-center gap-1.5 group relative", isMine ? "justify-end" : "justify-start")}>
            <div
               className={cn(
                  "flex max-w-[80%] flex-col rounded-2xl shadow-xs border relative select-none px-3 py-1.5",
                  isMine 
                     ? "bg-primary/10 text-primary-foreground/70 border-primary/20 rounded-tr-none" 
                     : "bg-muted/40 text-muted-foreground border-border rounded-tl-none"
               )}
            >
               <p className="italic text-xs font-sans flex items-center gap-1.5 text-muted-foreground">
                  <Ban className="h-3.5 w-3.5 shrink-0 opacity-70" />
                  {t("deletedMessage")}
               </p>
               <span className={cn(
                  "mt-0.5 text-[10px] opacity-60 font-sans tracking-wide",
                  isMine ? "text-right text-muted-foreground" : "text-left text-muted-foreground"
               )}>
                  {dateLabel}
               </span>
            </div>
         </div>
      );
   }

   return (
      <div className={cn("flex w-full items-center gap-1 group relative", isMine ? "justify-end" : "justify-start")}>
         <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            {/* Action Buttons Toolbar (Visible on hover on desktop) */}
            {!isEditing && (
               <div className={cn("hidden md:flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-200", isMine ? "order-first" : "order-last")}>
                  {/* Reaction Popover Trigger */}
                  <PopoverTrigger asChild>
                     <button 
                        className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer"
                        aria-label="Add reaction"
                     >
                        <Smile className="h-4 w-4" />
                     </button>
                  </PopoverTrigger>

                  {/* More Actions Dropdown (Desktop) */}
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <button
                           className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground active:scale-95 cursor-pointer"
                           aria-label="More actions"
                        >
                           <MoreVertical className="h-4 w-4" />
                        </button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align={isMine ? "end" : "start"} className="w-40 z-50">
                        {isMine && message.type === 'text' && (
                           <DropdownMenuItem onClick={handleStartEdit} className="cursor-pointer">
                              <Pencil className="h-3.5 w-3.5 mr-2" />
                              <span>{t("edit")}</span>
                           </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                           onClick={() => setIsDeleteDialogOpen(true)} 
                           className="text-destructive focus:text-destructive cursor-pointer"
                        >
                           <Trash2 className="h-3.5 w-3.5 mr-2" />
                           <span>{t("delete")}</span>
                        </DropdownMenuItem>
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            )}

            <PopoverContent 
               side="top" 
               align={isMine ? "end" : "start"} 
               className="w-auto p-1.5 flex flex-col gap-1.5 bg-background/95 backdrop-blur-md shadow-lg border rounded-2xl animate-in fade-in-50 slide-in-from-bottom-1 z-50 min-w-[200px]"
            >
               {/* Emojis Row */}
               <div className="flex gap-0.5 items-center justify-between">
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
               </div>

               {/* Mobile / Popover Actions */}
               <div className="flex items-center gap-1 border-t border-border/60 pt-1.5 px-0.5">
                  {isMine && message.type === 'text' && (
                     <button
                        onClick={() => {
                           setIsPopoverOpen(false);
                           handleStartEdit();
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg hover:bg-muted active:bg-muted/80 text-foreground transition-colors cursor-pointer"
                     >
                        <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                        <span>{t("edit")}</span>
                     </button>
                  )}
                  <button
                     onClick={() => {
                        setIsPopoverOpen(false);
                        setIsDeleteDialogOpen(true);
                     }}
                     className="flex-1 flex items-center justify-center gap-1.5 py-1 px-2 text-xs font-medium rounded-lg hover:bg-destructive/10 active:bg-destructive/20 text-destructive transition-colors cursor-pointer"
                  >
                     <Trash2 className="h-3.5 w-3.5" />
                     <span>{t("delete")}</span>
                  </button>
               </div>
            </PopoverContent>

            {/* Bubble Container */}
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
                     message.type === 'image' ? "p-1.5" : "px-3 py-1.5",
                     isEditing && "min-w-[280px] sm:min-w-[340px] bg-background text-foreground border-border shadow-md"
                  )}
               >
                  {isEditing ? (
               /* Inline Edit Mode */
               <div className="flex flex-col gap-2 py-1">
                  <Textarea
                     value={editContent}
                     onChange={(e) => setEditContent(e.target.value)}
                     className="min-h-[60px] text-sm resize-none rounded-lg bg-muted/40 border-border focus-visible:ring-1 focus-visible:ring-primary text-foreground font-sans"
                     autoFocus
                     onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                           e.preventDefault();
                           handleSaveEdit();
                        } else if (e.key === "Escape") {
                           handleCancelEdit();
                        }
                     }}
                  />
                  <div className="flex justify-end gap-1.5">
                     <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 px-2 text-xs rounded-full"
                        onClick={handleCancelEdit}
                        disabled={isSavingEdit}
                     >
                        <X className="h-3.5 w-3.5 mr-1" />
                        {t("cancel")}
                     </Button>
                     <Button
                        size="sm"
                        className="h-7 px-3 text-xs rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                        onClick={handleSaveEdit}
                        disabled={!editContent.trim() || isSavingEdit}
                     >
                        {isSavingEdit ? (
                           <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                           <>
                              <Check className="h-3.5 w-3.5 mr-1" />
                              {t("save")}
                           </>
                        )}
                     </Button>
                  </div>
               </div>
            ) : (
               <>
                  {message.type === 'image' ? (
                     <div className="flex flex-col overflow-hidden rounded-xl">
                        <MessageGallery 
                           message={message}
                           urls={message.mediaUrls} 
                           caption={message.content} 
                           onImageClick={handleImageClick}
                           toggleReaction={toggleReaction}
                           participantDetails={participantDetails}
                        />
                        {message.content && message.content !== "Sent images" && message.content !== "Sent an image" && (
                           <p className="px-3 pt-2 pb-1 text-sm whitespace-pre-wrap break-words leading-relaxed font-sans">
                              {renderFormattedMessageText(message.content, isMine)}
                           </p>
                        )}
                        {message.linkPreview && (
                           <div className="px-1.5 pb-1.5">
                              <LinkPreviewCard preview={message.linkPreview} isMine={isMine} />
                           </div>
                        )}
                     </div>
                  ) : (
                     <div>
                        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed font-sans">
                           {renderFormattedMessageText(message.content, isMine)}
                        </p>
                        {message.linkPreview && (
                           <LinkPreviewCard preview={message.linkPreview} isMine={isMine} />
                        )}
                     </div>
                  )}
                  
                  <div className={cn(
                     "mt-0.5 flex items-center gap-1 text-[10px] opacity-70 font-sans tracking-wide",
                     message.type === 'image' ? "px-2 pb-1" : "",
                     isMine ? "justify-end text-primary-foreground/80" : "justify-start text-muted-foreground"
                  )}>
                     <span>{dateLabel}</span>
                     {message.isEdited && (
                        <span>• {t("edited")}</span>
                     )}
                  </div>

                  <MessageReactions 
                     message={message} 
                     participantDetails={participantDetails} 
                     isMine={isMine}
                     onReact={(emoji, imgIdx) => toggleReaction(message, emoji, imgIdx)} 
                  />
               </>
            )}
         </div>
      </PopoverAnchor>
   </Popover>

         {/* Lightbox for images */}
         {message.type === 'image' && (
            <MediaLightbox 
               message={message}
               urls={message.mediaUrls}
               initialIndex={activeIndex}
               isOpen={isLightboxOpen}
               onClose={() => setIsLightboxOpen(false)}
               onReact={toggleReaction}
               participantDetails={participantDetails}
            />
         )}

         {/* Delete Confirmation Dialog */}
         <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <AlertDialogContent className="max-w-[320px] sm:max-w-[340px] p-5 rounded-2xl gap-3 border shadow-lg">
               <AlertDialogHeader className="gap-1 text-left sm:text-left">
                  <AlertDialogTitle className="font-display text-base font-semibold">
                     {t("deleteMessageTitle")}
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
                     {isMine ? t("deleteForEveryoneDesc") : t("deleteForMeDesc")}
                  </AlertDialogDescription>
               </AlertDialogHeader>

               <AlertDialogFooter className="flex-col sm:flex-col gap-1.5 mt-2">
                  {isMine && (
                     <Button
                        variant="destructive"
                        className="w-full rounded-full h-8.5 text-xs font-medium"
                        onClick={handleDeleteForEveryone}
                        disabled={isDeleting}
                     >
                        {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                        {t("deleteForEveryone")}
                     </Button>
                  )}
                  <Button
                     variant={isMine ? "outline" : "destructive"}
                     className="w-full rounded-full h-8.5 text-xs font-medium"
                     onClick={handleDeleteForMe}
                     disabled={isDeleting}
                  >
                     {isDeleting ? <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" /> : null}
                     {t("deleteForMe")}
                  </Button>
                  <AlertDialogCancel className="w-full rounded-full h-8.5 text-xs font-medium mt-0 border-border" disabled={isDeleting}>
                     {t("cancel")}
                  </AlertDialogCancel>
               </AlertDialogFooter>
            </AlertDialogContent>
         </AlertDialog>
      </div>
   );
};

