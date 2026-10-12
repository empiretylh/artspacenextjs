'use client'

import React from "react";
import type { Board } from "@/types";
import { getImage, cn } from "@/lib/utils";
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
   const artworkCount = board.artworks_count ?? (board.artworks?.length || 0);

   const coverSrc = board.cover_image
      ? getImage(board.cover_image)
      : board.artworks?.[0]?.image
      ? getImage(board.artworks[0].image)
      : null;

   return (
      <div
         onClick={onClick}
         className="group relative flex flex-col rounded-xl border border-border/80 bg-card hover:bg-card/90 overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-md hover:border-primary/40 text-left"
      >
         {/* Cover Image / Thumbnail */}
         <div className="relative aspect-4/3 w-full bg-muted/60 overflow-hidden flex items-center justify-center">
            {coverSrc ? (
               <AppImage
                  src={coverSrc}
                  alt={board.name}
                  width={600}
                  height={450}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
               />
            ) : (
               <div className="flex flex-col items-center justify-center text-muted-foreground/60 gap-2 p-6 text-center">
                  {board.is_default ? (
                     <Bookmark className="w-12 h-12 stroke-[1.5] text-primary/70" />
                  ) : (
                     <FolderHeart className="w-12 h-12 stroke-[1.5] text-primary/70" />
                  )}
                  <span className="text-xs font-medium">Empty Board</span>
               </div>
            )}

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
               {board.is_default && (
                  <Badge
                     variant="default"
                     className="bg-primary text-primary-foreground text-[10px] font-semibold gap-1 px-2 py-0.5 shadow-sm"
                  >
                     <Bookmark className="w-3 h-3 fill-current" />
                     Default
                  </Badge>
               )}
               <Badge
                  variant="secondary"
                  className="bg-black/60 text-white backdrop-blur-xs border-white/10 text-[10px] font-medium gap-1 px-2 py-0.5"
               >
                  {board.visibility === "PUBLIC" ? (
                     <>
                        <Globe className="w-3 h-3" /> Public
                     </>
                  ) : (
                     <>
                        <Lock className="w-3 h-3" /> Private
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
                           className="h-8 w-8 rounded-full bg-black/50 text-white hover:bg-black/80 hover:text-white"
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

            {/* Bottom count overlay */}
            <div className="absolute bottom-2.5 right-2.5 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-xs text-white text-xs font-medium">
               <Layers className="w-3 h-3" />
               <span>
                  {artworkCount} {artworkCount === 1 ? "work" : "works"}
               </span>
            </div>
         </div>

         {/* Content info */}
         <div className="p-3.5 space-y-1">
            <h3 className="font-semibold text-base font-display text-foreground line-clamp-1 group-hover:text-primary transition-colors">
               {board.name}
            </h3>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
               {board.is_default
                  ? "Default saved artworks"
                  : `${board.visibility === "PUBLIC" ? "Public" : "Private"} board`}
            </p>
         </div>
      </div>
   );
};
