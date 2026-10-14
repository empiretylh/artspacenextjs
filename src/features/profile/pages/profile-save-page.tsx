'use client'

import React, { useState } from "react";
import type { Board } from "@/types";
import { useGetBoards, extractBoards } from "@/features/service/artspace/get-boards";
import { useDeleteBoard } from "@/features/service/artspace/board-mutations";
import { BoardCard } from "@/features/boards/components/board-card";
import { BoardArtworksView } from "@/features/boards/components/board-artworks-view";
import { CreateBoardDialog } from "@/features/boards/components/create-board-dialog";
import { EditBoardDialog } from "@/features/boards/components/edit-board-dialog";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/components/ui/notifications";
import { Plus, Bookmark, Loader2, Trash2 } from "lucide-react";

export const ProfileSavePage = () => {
   const { data: boardsData, isLoading } = useGetBoards();
   const boards = extractBoards(boardsData);

   const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [editingBoard, setEditingBoard] = useState<Board | null>(null);
   const [deletingBoard, setDeletingBoard] = useState<Board | null>(null);

   const deleteBoardMutation = useDeleteBoard();

   // Find currently active board if selected
   const selectedBoard = boards.find((b) => b.id === selectedBoardId) || null;

   const handleDeleteConfirm = () => {
      if (!deletingBoard || deletingBoard.is_default) return;

      deleteBoardMutation.mutate(
         { boardId: deletingBoard.id },
         {
            onSuccess: () => {
               useNotifications.getState().addNotification({
                  type: "success",
                  title: "Board Deleted",
                  message: `Board "${deletingBoard.name}" was deleted.`,
               });
               if (selectedBoardId === deletingBoard.id) {
                  setSelectedBoardId(null);
               }
               setDeletingBoard(null);
            },
         }
      );
   };

   // Shared Delete Confirmation Dialog
   const renderDeleteDialog = () => (
      <Dialog
         open={!!deletingBoard}
         onOpenChange={(open) => {
            if (!open) setDeletingBoard(null);
         }}
      >
         <DialogContent className="sm:max-w-sm p-0 overflow-hidden gap-0 border border-border/80 shadow-2xl bg-card">
            <DialogHeader className="p-5 pb-3 border-b border-border/60 text-left">
               <DialogTitle className="text-base font-semibold font-display tracking-tight text-foreground flex items-center gap-2">
                  <span className="p-1.5 rounded-md bg-destructive/10 text-destructive">
                     <Trash2 className="w-4 h-4" />
                  </span>
                  Delete Board
               </DialogTitle>
               <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  This action cannot be undone.
               </DialogDescription>
            </DialogHeader>

            <div className="p-5 space-y-4">
               <p className="text-xs text-muted-foreground leading-relaxed">
                  Are you sure you want to delete{" "}
                  <span className="font-semibold text-foreground">
                     "{deletingBoard?.name}"
                  </span>
                  ? Artworks saved inside this board will remain safe in the gallery.
               </p>

               <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                  <Button
                     variant="outline"
                     size="sm"
                     onClick={() => setDeletingBoard(null)}
                     disabled={deleteBoardMutation.isPending}
                     className="text-xs"
                  >
                     Cancel
                  </Button>
                  <Button
                     variant="destructive"
                     size="sm"
                     onClick={handleDeleteConfirm}
                     disabled={deleteBoardMutation.isPending}
                     className="text-xs font-semibold gap-1.5"
                  >
                     {deleteBoardMutation.isPending && (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                     )}
                     Delete Board
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );

   // If viewing a specific board's artworks
   if (selectedBoard) {
      return (
         <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl">
            <BoardArtworksView
               board={selectedBoard}
               onBack={() => setSelectedBoardId(null)}
               onEdit={() => setEditingBoard(selectedBoard)}
               onDelete={() => setDeletingBoard(selectedBoard)}
            />

            {/* Edit Dialog */}
            <EditBoardDialog
               isOpen={!!editingBoard}
               onClose={() => setEditingBoard(null)}
               board={editingBoard}
            />

            {/* Delete Confirmation */}
            {renderDeleteDialog()}
         </div>
      );
   }

   // Default: Boards Grid View
   return (
      <div className="container mx-auto px-4 py-4 sm:py-6 max-w-7xl space-y-6">
         {/* Top Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
            <div>
               <h1 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground">
                  Boards
               </h1>
               <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Save and organize your favorite artworks into custom collections.
               </p>
            </div>

            <Button
               onClick={() => setIsCreateOpen(true)}
               className="gap-2 font-semibold self-start sm:self-center"
               size="sm"
            >
               <Plus className="w-4 h-4" />
               Create Board
            </Button>
         </div>

         {/* Content */}
         {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 py-8">
               {Array.from({ length: 4 }).map((_, i) => (
                  <div
                     key={i}
                     className="aspect-4/3 rounded-xl bg-muted/60 animate-pulse"
                  />
               ))}
            </div>
         ) : boards.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 max-w-md mx-auto border border-dashed rounded-2xl p-8 bg-card/40">
               <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bookmark className="w-7 h-7 stroke-[1.5]" />
               </div>
               <div className="space-y-1.5">
                  <h3 className="font-semibold text-lg font-display">
                     No boards yet
                  </h3>
                  <p className="text-xs text-muted-foreground">
                     Create custom boards or save artworks to your default "Save for Later" board while browsing.
                  </p>
               </div>
               <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="gap-2 font-semibold"
                  size="sm"
               >
                  <Plus className="w-4 h-4" />
                  Create Your First Board
               </Button>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
               {boards.map((board) => (
                  <BoardCard
                     key={board.id}
                     board={board}
                     onClick={() => setSelectedBoardId(board.id)}
                     onEdit={() => setEditingBoard(board)}
                     onDelete={() => setDeletingBoard(board)}
                  />
               ))}
            </div>
         )}

         {/* Create Board Dialog */}
         <CreateBoardDialog
            isOpen={isCreateOpen}
            onClose={() => setIsCreateOpen(false)}
         />

         {/* Edit Board Dialog */}
         <EditBoardDialog
            isOpen={!!editingBoard}
            onClose={() => setEditingBoard(null)}
            board={editingBoard}
         />

         {/* Delete Confirmation */}
         {renderDeleteDialog()}
      </div>
   );
};

export default ProfileSavePage;
