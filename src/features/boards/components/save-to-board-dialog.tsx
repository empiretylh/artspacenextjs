'use client'

import React, { useState } from "react";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/components/ui/notifications";
import { useGetBoards, extractBoards } from "@/features/service/artspace/get-boards";
import {
   useGetArtworkSaveStatus,
   useSaveArtwork,
   useUnsaveArtwork,
} from "@/features/service/artspace/save-artwork";
import { useCreateBoard } from "@/features/service/artspace/board-mutations";
import type { Artwork, BoardVisibility } from "@/types";
import { getImage, cn } from "@/lib/utils";
import AppImage from "@/components/common/app-image";
import {
   Bookmark,
   Globe,
   Lock,
   Plus,
   Loader2,
   FolderHeart,
   Check,
} from "lucide-react";

interface SaveToBoardDialogProps {
   isOpen: boolean;
   onClose: () => void;
   artwork: Artwork;
}

export const SaveToBoardDialog: React.FC<SaveToBoardDialogProps> = ({
   isOpen,
   onClose,
   artwork,
}) => {
   const artworkId = String(artwork.id);

   // Queries
   const { data: boardsData, isLoading: isBoardsLoading } = useGetBoards({
      enabled: isOpen,
   });
   const { data: saveStatus, isLoading: isStatusLoading } = useGetArtworkSaveStatus({
      artworkId,
      enabled: isOpen,
   });

   // Mutations
   const saveMutation = useSaveArtwork();
   const unsaveMutation = useUnsaveArtwork();
   const createBoardMutation = useCreateBoard();

   // Inline create board state
   const [isCreating, setIsCreating] = useState(false);
   const [newBoardName, setNewBoardName] = useState("");
   const [newBoardVisibility, setNewBoardVisibility] =
      useState<BoardVisibility>("PRIVATE");
   const [createError, setCreateError] = useState<string | null>(null);

   const boards = extractBoards(boardsData);
   const savedCollectionIds = new Set(
      ((saveStatus?.collections ?? saveStatus?.boards ?? []) as { id: string | number }[]).map(
         (c) => String(c.id)
      )
   );

   const handleToggleBoard = (boardId: string, isCurrentlySaved: boolean) => {
      if (isCurrentlySaved) {
         unsaveMutation.mutate(
            {
               artworkId,
               data: { collection_id: boardId },
            },
            {
               onSuccess: () => {
                  useNotifications.getState().addNotification({
                     type: "success",
                     title: "Removed from board",
                     message: "Artwork removed from board.",
                  });
               },
               onError: (err: any) => {
                  useNotifications.getState().addNotification({
                     type: "error",
                     title: "Failed to remove",
                     message:
                        err.response?.data?.detail ||
                        err.message ||
                        "Could not remove artwork from board.",
                  });
               },
            }
         );
      } else {
         saveMutation.mutate(
            {
               artworkId,
               data: { collection_id: boardId },
            },
            {
               onSuccess: () => {
                  useNotifications.getState().addNotification({
                     type: "success",
                     title: "Saved to board",
                     message: "Artwork added to board.",
                  });
               },
               onError: (err: any) => {
                  useNotifications.getState().addNotification({
                     type: "error",
                     title: "Failed to save",
                     message:
                        err.response?.data?.detail ||
                        err.message ||
                        "Could not save artwork to board.",
                  });
               },
            }
         );
      }
   };

   const handleCreateAndSave = (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = newBoardName.trim();
      if (!trimmed) {
         setCreateError("Board name is required.");
         return;
      }

      setCreateError(null);

      createBoardMutation.mutate(
         {
            name: trimmed,
            visibility: newBoardVisibility,
         },
         {
            onSuccess: (createdBoard) => {
               saveMutation.mutate(
                  {
                     artworkId,
                     data: { collection_id: createdBoard.id },
                  },
                  {
                     onSuccess: () => {
                        useNotifications.getState().addNotification({
                           type: "success",
                           title: "Saved to new board",
                           message: `Created "${createdBoard.name}" and saved artwork.`,
                        });
                        setNewBoardName("");
                        setIsCreating(false);
                     },
                  }
               );
            },
            onError: (err: any) => {
               setCreateError(
                  err.response?.data?.name?.[0] ||
                     err.response?.data?.detail ||
                     err.message ||
                     "Failed to create board."
               );
            },
         }
      );
   };

   const handleClose = () => {
      setIsCreating(false);
      setNewBoardName("");
      setCreateError(null);
      onClose();
   };

   const isLoading = isBoardsLoading || isStatusLoading;

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 border border-border/80 shadow-xl bg-card">
            {/* 1. Header with clear Title & Subtitle */}
            <DialogHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 text-left">
               <DialogTitle className="text-lg font-semibold font-display tracking-tight text-foreground flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-primary fill-primary" />
                  Save to board
               </DialogTitle>
               <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  Organize and save this artwork to your boards.
               </DialogDescription>
            </DialogHeader>

            {/* 2. Artwork Preview Bar */}
            <div className="px-4 sm:px-5 py-3 bg-muted/30 border-b border-border/60">
               <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-border/60 bg-muted">
                     <AppImage
                        src={getImage(artwork.image)}
                        alt={artwork.title}
                        width={48}
                        height={48}
                        className="object-cover w-full h-full"
                     />
                  </div>
                  <div className="min-w-0 flex-1">
                     <h4 className="text-sm font-semibold font-display text-foreground line-clamp-1">
                        {artwork.title}
                     </h4>
                     {artwork.artist_name && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                           {artwork.artist_name}
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {/* 3. Boards List */}
            <div className="p-4 sm:p-5 py-3 space-y-1.5 max-h-60 overflow-y-auto">
               <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-1 pb-1">
                  <span>Your Boards</span>
                  <span>{boards.length} total</span>
               </div>

               {isLoading ? (
                  <div className="flex items-center justify-center py-8 text-muted-foreground gap-2">
                     <Loader2 className="w-4 h-4 animate-spin text-primary" />
                     <span className="text-xs">Loading boards...</span>
                  </div>
               ) : boards.length === 0 ? (
                  <div className="text-center py-6 px-4 space-y-2 border border-dashed rounded-lg bg-muted/20">
                     <FolderHeart className="w-8 h-8 text-muted-foreground/60 mx-auto" />
                     <p className="text-xs text-muted-foreground">
                        No boards found yet. Create your first board below.
                     </p>
                  </div>
               ) : (
                  boards.map((b) => {
                     const isSaved = savedCollectionIds.has(String(b.id));
                     const isMutating =
                        saveMutation.isPending || unsaveMutation.isPending;

                     return (
                        <label
                           key={b.id}
                           className={cn(
                              "flex items-center justify-between p-2.5 rounded-lg border transition-all cursor-pointer select-none",
                              isSaved
                                 ? "bg-primary/5 border-primary/40 text-foreground"
                                 : "bg-card hover:bg-muted/50 border-border/60 text-foreground"
                           )}
                        >
                           <div className="flex items-center gap-3 min-w-0 pr-2">
                              <Checkbox
                                 checked={isSaved}
                                 disabled={isMutating}
                                 onCheckedChange={() =>
                                    handleToggleBoard(String(b.id), isSaved)
                                 }
                                 className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                              />
                              <div className="min-w-0">
                                 <div className="text-xs font-medium truncate flex items-center gap-1.5">
                                    <span className="truncate">{b.name}</span>
                                    {b.is_default && (
                                       <Badge
                                          variant="outline"
                                          className="text-[9px] px-1 py-0 border-primary/40 text-primary font-semibold"
                                       >
                                          Default
                                       </Badge>
                                    )}
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-1.5 text-muted-foreground shrink-0 text-xs">
                              {b.visibility === "PUBLIC" ? (
                                 <span
                                    title="Public board"
                                    className="flex items-center gap-1 text-[11px] text-muted-foreground/80"
                                 >
                                    <Globe className="w-3.5 h-3.5" />
                                 </span>
                              ) : (
                                 <span
                                    title="Private board"
                                    className="flex items-center gap-1 text-[11px] text-muted-foreground/80"
                                 >
                                    <Lock className="w-3.5 h-3.5" />
                                 </span>
                              )}
                           </div>
                        </label>
                     );
                  })
               )}
            </div>

            {/* 4. Footer & Inline Board Creation Form */}
            <div className="p-4 sm:p-5 pt-3 border-t border-border/60 bg-muted/15">
               {!isCreating ? (
                  <div className="flex items-center justify-between gap-2">
                     <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsCreating(true)}
                        className="text-xs font-semibold gap-1.5 text-primary hover:text-primary hover:bg-primary/10 -ml-2"
                     >
                        <Plus className="w-4 h-4" />
                        Create new board
                     </Button>

                     <Button
                        type="button"
                        variant="default"
                        size="sm"
                        onClick={handleClose}
                        className="text-xs font-semibold px-4"
                     >
                        Done
                     </Button>
                  </div>
               ) : (
                  <form onSubmit={handleCreateAndSave} className="space-y-3">
                     <div className="flex items-center justify-between">
                        <Label
                           htmlFor="inline-board-name"
                           className="text-xs font-semibold text-foreground"
                        >
                           New Board
                        </Label>
                        <button
                           type="button"
                           onClick={() => {
                              setIsCreating(false);
                              setNewBoardName("");
                              setCreateError(null);
                           }}
                           className="text-[11px] text-muted-foreground hover:text-foreground"
                        >
                           Cancel
                        </button>
                     </div>

                     <div className="space-y-1">
                        <Input
                           id="inline-board-name"
                           placeholder="Enter board name..."
                           value={newBoardName}
                           onChange={(e) => {
                              setNewBoardName(e.target.value);
                              if (createError) setCreateError(null);
                           }}
                           autoFocus
                           className="h-9 text-xs bg-background"
                           maxLength={100}
                           disabled={createBoardMutation.isPending}
                        />
                        {createError && (
                           <p className="text-[11px] text-destructive">{createError}</p>
                        )}
                     </div>

                     {/* Privacy Selection */}
                     <div className="flex items-center justify-between gap-3 pt-1">
                        <div className="flex items-center gap-1.5 bg-muted/60 p-0.5 rounded-lg border border-border/60">
                           <button
                              type="button"
                              onClick={() => setNewBoardVisibility("PRIVATE")}
                              className={cn(
                                 "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                                 newBoardVisibility === "PRIVATE"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                              )}
                           >
                              <Lock className="w-3 h-3" />
                              Private
                           </button>

                           <button
                              type="button"
                              onClick={() => setNewBoardVisibility("PUBLIC")}
                              className={cn(
                                 "flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-medium transition-all",
                                 newBoardVisibility === "PUBLIC"
                                    ? "bg-background text-foreground shadow-xs"
                                    : "text-muted-foreground hover:text-foreground"
                              )}
                           >
                              <Globe className="w-3 h-3" />
                              Public
                           </button>
                        </div>

                        <div className="flex items-center gap-2">
                           <Button
                              type="submit"
                              size="sm"
                              className="h-8 text-xs font-semibold px-3"
                              disabled={
                                 createBoardMutation.isPending || !newBoardName.trim()
                              }
                           >
                              {createBoardMutation.isPending && (
                                 <Loader2 className="w-3 h-3 mr-1.5 animate-spin" />
                              )}
                              Create & Save
                           </Button>
                        </div>
                     </div>
                  </form>
               )}
            </div>
         </DialogContent>
      </Dialog>
   );
};
