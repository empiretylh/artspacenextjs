'use client'

import React from "react";
import type { Board } from "@/types";
import { getImage, cn, timeAgo } from "@/lib/utils";
import AppImage from "@/components/common/app-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
   Bookmark,
   Globe,
   Lock,
   MoreVertical,
   Pencil,
   Trash2,
   FolderHeart,
   Layers,
} from "lucide-react";

interface BoardCardProps {
   board: Board;
   onClick: () => void;
   onEdit?: () => void;
   onDelete?: () => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({
   board,
   onClick,
   onEdit,
   onDelete,
}) => {
   // 1. Total artwork count
   const totalCount =
      board.artwork_count ??
      board.artworks_count ??
      (board.items?.length || board.artworks?.length || 0);

   // 2. Extract artwork image URLs from items, artworks, or cover_image
   const artworkImages: string[] = React.useMemo(() => {
      const list: string[] = [];
      if (board.items && Array.isArray(board.items)) {
         for (const item of board.items) {
            const img = item.artwork?.image;
            if (img && typeof img === "string") {
               list.push(img);
            }
         }
      }
      if (list.length === 0 && board.artworks && Array.isArray(board.artworks)) {
         for (const art of board.artworks) {
            if (art.image && typeof art.image === "string") {
               list.push(art.image);
            }
         }
      }
      if (list.length === 0 && board.cover_image) {
         list.push(board.cover_image);
      }
      return list;
   }, [board.items, board.artworks, board.cover_image]);

   const effectiveTotal = Math.max(totalCount, artworkImages.length);
   const hasImages = artworkImages.length > 0;

   const timeText = React.useMemo(() => {
      const dateStr = board.updated_at || board.created_at;
      if (!dateStr) return null;
      try {
         return timeAgo(dateStr);
      } catch {
         return null;
      }
   }, [board.updated_at, board.created_at]);

   const renderCover = () => {
      // Case 0: No images available (e.g. Owner boards list without items, or empty board)
      if (artworkImages.length === 0) {
         return (
            <div className="relative w-full h-full bg-gradient-to-br from-primary/10 via-muted/40 to-primary/5 dark:from-primary/10 dark:via-muted/20 dark:to-card flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden">
               {/* Ambient background glow */}
               <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />
               <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

               {/* Central icon container */}
               <div
                  className={cn(
                     "relative w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105 shadow-xs border",
                     board.is_default
                        ? "bg-primary/15 border-primary/30 text-primary"
                        : "bg-background/80 dark:bg-card/80 border-border/60 text-primary backdrop-blur-xs"
                  )}
               >
                  {board.is_default ? (
                     <Bookmark className="w-7 h-7 fill-primary/30 stroke-[1.8]" />
                  ) : (
                     <FolderHeart className="w-7 h-7 stroke-[1.8]" />
                  )}
               </div>

               {/* Artwork count pill or empty label */}
               <div className="mt-3 z-10">
                  {effectiveTotal > 0 ? (
                     <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-background/80 dark:bg-card/80 border border-border/60 text-foreground backdrop-blur-xs shadow-xs">
                        <Layers className="w-3.5 h-3.5 text-primary" />
                        {effectiveTotal} {effectiveTotal === 1 ? "saved work" : "saved works"}
                     </span>
                  ) : (
                     <span className="text-xs font-medium text-muted-foreground/80">
                        No artworks yet
                     </span>
                  )}
               </div>
            </div>
         );
      }

      // Case 1: Exactly 1 image
      if (artworkImages.length === 1) {
         return (
            <div className="relative w-full h-full overflow-hidden bg-muted">
               <AppImage
                  src={getImage(artworkImages[0])}
                  alt={board.name}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
               {effectiveTotal > 1 && (
                  <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
                     <Layers className="w-3 h-3" />
                     <span>
                        {effectiveTotal} works
                     </span>
                  </div>
               )}
            </div>
         );
      }

      // Case 2: Exactly 2 images (2 columns)
      if (artworkImages.length === 2) {
         return (
            <div className="relative grid grid-cols-2 w-full h-full gap-0.5 bg-border/40 overflow-hidden">
               {artworkImages.map((img, i) => (
                  <div key={i} className="relative w-full h-full overflow-hidden bg-muted">
                     <AppImage
                        src={getImage(img)}
                        alt={`${board.name} ${i + 1}`}
                        width={300}
                        height={450}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                  </div>
               ))}
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>
         );
      }

      // Case 3: Exactly 3 images (1 large on left, 2 stacked on right)
      if (artworkImages.length === 3) {
         return (
            <div className="relative grid grid-cols-2 w-full h-full gap-0.5 bg-border/40 overflow-hidden">
               <div className="relative w-full h-full overflow-hidden bg-muted">
                  <AppImage
                     src={getImage(artworkImages[0])}
                     alt={`${board.name} 1`}
                     width={300}
                     height={450}
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
               </div>
               <div className="grid grid-rows-2 gap-0.5 h-full">
                  {artworkImages.slice(1, 3).map((img, i) => (
                     <div key={i} className="relative w-full h-full overflow-hidden bg-muted">
                        <AppImage
                           src={getImage(img)}
                           alt={`${board.name} ${i + 2}`}
                           width={300}
                           height={225}
                           className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                     </div>
                  ))}
               </div>
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20 pointer-events-none" />
            </div>
         );
      }

      // Case 4: 4 or more images (2x2 grid collage, 4th item shows +remaining if total > 4)
      const displayImages = artworkImages.slice(0, 4);
      const remaining = effectiveTotal > 4 ? effectiveTotal - 4 : 0;

      return (
         <div className="relative grid grid-cols-2 grid-rows-2 w-full h-full gap-0.5 bg-border/40 overflow-hidden">
            {displayImages.map((img, idx) => {
               const isFourthWithRemaining = idx === 3 && remaining > 0;

               return (
                  <div key={idx} className="relative w-full h-full overflow-hidden bg-muted">
                     <AppImage
                        src={getImage(img)}
                        alt={`${board.name} ${idx + 1}`}
                        width={300}
                        height={225}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                     />
                     {isFourthWithRemaining && (
                        <div className="absolute inset-0 bg-black/65 backdrop-blur-[1px] flex items-center justify-center text-white font-bold text-base sm:text-lg tracking-tight select-none">
                           +{remaining}
                        </div>
                     )}
                  </div>
               );
            })}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20 pointer-events-none" />
         </div>
      );
   };

   return (
      <div
         onClick={onClick}
         className="group relative flex flex-col rounded-xl border border-border/80 bg-card hover:bg-card/90 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/40 text-left"
      >
         {/* Cover Image / Multi-Image Collage / Stylized Canvas */}
         <div className="relative aspect-4/3 w-full bg-muted/40 overflow-hidden flex items-center justify-center border-b border-border/60">
            {renderCover()}

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
               {board.is_default && (
                  <Badge
                     variant="default"
                     className="bg-primary text-primary-foreground text-[10px] font-semibold gap-1 px-2 py-0.5 shadow-xs"
                  >
                     <Bookmark className="w-3 h-3 fill-current" />
                     Default
                  </Badge>
               )}
               <Badge
                  variant="secondary"
                  className={cn(
                     "text-[10px] font-medium gap-1 px-2 py-0.5 backdrop-blur-xs shadow-xs",
                     hasImages
                        ? "bg-black/60 text-white border-white/10"
                        : "bg-background/80 dark:bg-card/80 text-foreground border-border/60"
                  )}
               >
                  {board.visibility === "PUBLIC" ? (
                     <>
                        <Globe className="w-3 h-3 text-muted-foreground" /> Public
                     </>
                  ) : (
                     <>
                        <Lock className="w-3 h-3 text-muted-foreground" /> Private
                     </>
                  )}
               </Badge>
            </div>

            {/* Action Menu (owner-only actions, non-default only) */}
            {!board.is_default && (onEdit || onDelete) && (
               <div
                  className="absolute top-2 right-2 z-20"
                  onClick={(e) => e.stopPropagation()}
               >
                  <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                        <Button
                           variant="ghost"
                           size="icon"
                           className={cn(
                              "h-8 w-8 rounded-full transition-colors",
                              hasImages
                                 ? "bg-black/50 text-white hover:bg-black/80 hover:text-white"
                                 : "bg-background/80 dark:bg-card/80 text-foreground hover:bg-muted border border-border/60 shadow-xs"
                           )}
                        >
                           <MoreVertical className="h-4 w-4" />
                           <span className="sr-only">Board actions</span>
                        </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end" className="w-36">
                        {onEdit && (
                           <DropdownMenuItem
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onEdit();
                              }}
                              className="gap-2 cursor-pointer"
                           >
                              <Pencil className="h-4 w-4" /> Edit
                           </DropdownMenuItem>
                        )}
                        {onEdit && onDelete && <DropdownMenuSeparator />}
                        {onDelete && (
                           <DropdownMenuItem
                              onClick={(e) => {
                                 e.stopPropagation();
                                 onDelete();
                              }}
                              variant="destructive"
                              className="gap-2 cursor-pointer text-destructive focus:text-destructive"
                           >
                              <Trash2 className="h-4 w-4" /> Delete
                           </DropdownMenuItem>
                        )}
                     </DropdownMenuContent>
                  </DropdownMenu>
               </div>
            )}
         </div>

         {/* Content info */}
         <div className="p-3.5 space-y-1">
            <h3 className="font-semibold text-base font-display text-foreground line-clamp-1 group-hover:text-primary transition-colors">
               {board.name}
            </h3>
            <div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
               <span className="font-medium text-foreground/80 truncate">
                  {effectiveTotal > 0
                     ? `${effectiveTotal} ${effectiveTotal === 1 ? "artwork" : "artworks"}`
                     : "Empty board"}
               </span>
               {timeText && (
                  <span className="text-[11px] text-muted-foreground/70 shrink-0">
                     {timeText}
                  </span>
               )}
            </div>
         </div>
      </div>
   );
};

export default BoardCard;
