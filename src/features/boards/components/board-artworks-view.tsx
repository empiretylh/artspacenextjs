'use client'

import React from "react";
import type { Artwork, Board } from "@/types";
import { useGetBoardArtworksInfinite } from "@/features/service/artspace/get-board-artworks";
import { useRemoveArtworkFromBoard } from "@/features/service/artspace/board-mutations";
import ArtworkCard from "@/components/app/artwork-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/ui/notifications";
import {
   ArrowLeft,
   Bookmark,
   Globe,
   Lock,
   Pencil,
   Trash2,
   Layers,
   Loader2,
   Sparkles,
} from "lucide-react";

interface BoardArtworksViewProps {
   board: Board;
   onBack: () => void;
   onEdit?: () => void;
   onDelete?: () => void;
   isOwner?: boolean;
}

export const BoardArtworksView: React.FC<BoardArtworksViewProps> = ({
   board,
   onBack,
   onEdit,
   onDelete,
   isOwner = true,
}) => {
   const {
      data,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = useGetBoardArtworksInfinite({
      boardId: board.id,
      limit: 12,
   });

   const removeArtworkMutation = useRemoveArtworkFromBoard();

   // Flatten paginated artworks
   const artworks: Artwork[] = React.useMemo(() => {
      if (!data?.pages) return [];
      return data.pages.flatMap((page: any) => {
         const results = page?.results || [];
         return results.map((item: any) => (item.artwork ? item.artwork : item));
      });
   }, [data]);

   const handleRemove = (artworkId: string, artworkTitle?: string) => {
      removeArtworkMutation.mutate(
         {
            boardId: board.id,
            artworkId,
         },
         {
            onSuccess: () => {
               useNotifications.getState().addNotification({
                  type: "success",
                  title: "Artwork Removed",
                  message: artworkTitle
                     ? `"${artworkTitle}" was removed from "${board.name}".`
                     : `Artwork removed from "${board.name}".`,
               });
            },
         }
      );
   };

   return (
      <div className="space-y-6">
         {/* Top Navigation & Board Metadata */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b">
            <div className="space-y-2">
               <Button
                  variant="ghost"
                  size="sm"
                  onClick={onBack}
                  className="gap-2 -ml-2 text-muted-foreground hover:text-foreground"
               >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Boards
               </Button>
               <div className="flex items-center gap-2.5 flex-wrap">
                  <h1 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground">
                     {board.name}
                  </h1>
                  {board.is_default && (
                     <Badge
                        variant="default"
                        className="bg-primary text-primary-foreground text-xs font-semibold gap-1"
                     >
                        <Bookmark className="w-3 h-3 fill-current" />
                        Default
                     </Badge>
                  )}
                  <Badge
                     variant="outline"
                     className="text-xs font-medium gap-1"
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
                  <Badge variant="outline" className="text-xs font-medium gap-1 bg-muted/50 border-border text-foreground">
                     <Layers className="w-3 h-3" />
                     {artworks.length} {artworks.length === 1 ? "work" : "works"}
                  </Badge>
               </div>
            </div>

            {/* Owner Actions */}
            {!board.is_default && (onEdit || onDelete) && (
               <div className="flex items-center gap-2 self-start sm:self-center">
                  {onEdit && (
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="gap-1.5"
                     >
                        <Pencil className="w-3.5 h-3.5" />
                        Edit Board
                     </Button>
                  )}
                  {onDelete && (
                     <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDelete}
                        className="gap-1.5"
                     >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete Board
                     </Button>
                  )}
               </div>
            )}
         </div>

         {/* Artworks List / Grid */}
         {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-12">
               {Array.from({ length: 8 }).map((_, i) => (
                  <div
                     key={i}
                     className="aspect-square bg-muted/60 animate-pulse rounded-md"
                  />
               ))}
            </div>
         ) : artworks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 max-w-md mx-auto border border-dashed rounded-xl p-8 bg-card/40">
               <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles className="w-6 h-6" />
               </div>
               <div className="space-y-1">
                  <h3 className="font-semibold text-lg font-display">
                     No artworks in this board yet
                  </h3>
                  <p className="text-xs text-muted-foreground">
                     Save artworks while browsing by clicking the bookmark or save button to build your collection.
                  </p>
               </div>
            </div>
         ) : (
            <div className="space-y-8">
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                  {artworks.map((artwork) => (
                     <div key={artwork.id} className="relative group">
                        <ArtworkCard artwork={artwork} publicCard={true} />
                        {/* Remove button overlay */}
                        {isOwner && (
                           <div className="absolute top-2 left-2 z-20 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                              <Button
                                 size="icon"
                                 variant="destructive"
                                 className="h-8 w-8 rounded-full shadow-md"
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove(artwork.id, artwork.title);
                                 }}
                                 disabled={removeArtworkMutation.isPending}
                                 title="Remove from board"
                              >
                                 <Trash2 className="h-4 w-4" />
                              </Button>
                           </div>
                        )}
                     </div>
                  ))}
               </div>

               {hasNextPage && (
                  <div className="flex justify-center pt-4">
                     <Button
                        variant="outline"
                        onClick={() => fetchNextPage()}
                        disabled={isFetchingNextPage}
                        className="gap-2"
                     >
                        {isFetchingNextPage && (
                           <Loader2 className="w-4 h-4 animate-spin" />
                        )}
                        Load more artworks
                     </Button>
                  </div>
               )}
            </div>
         )}
      </div>
   );
};
