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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateBoard } from "@/features/service/artspace/board-mutations";
import { useNotifications } from "@/components/ui/notifications";
import type { BoardVisibility } from "@/types";
import { cn } from "@/lib/utils";
import { Globe, Lock, Loader2, FolderPlus } from "lucide-react";

interface CreateBoardDialogProps {
   isOpen: boolean;
   onClose: () => void;
   onCreated?: (boardId: string) => void;
}

export const CreateBoardDialog: React.FC<CreateBoardDialogProps> = ({
   isOpen,
   onClose,
   onCreated,
}) => {
   const [name, setName] = useState("");
   const [visibility, setVisibility] = useState<BoardVisibility>("PRIVATE");
   const [error, setError] = useState<string | null>(null);

   const createBoardMutation = useCreateBoard();

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = name.trim();

      if (!trimmedName) {
         setError("Board name is required.");
         return;
      }

      if (trimmedName.toLowerCase() === "save for later") {
         setError("'Save for Later' is reserved for the default board.");
         return;
      }

      setError(null);

      createBoardMutation.mutate(
         {
            name: trimmedName,
            visibility,
         },
         {
            onSuccess: (newBoard) => {
               useNotifications.getState().addNotification({
                  type: "success",
                  title: "Board Created",
                  message: `Board "${newBoard.name}" has been created.`,
               });
               setName("");
               setVisibility("PRIVATE");
               onClose();
               onCreated?.(newBoard.id);
            },
            onError: (err: any) => {
               const msg =
                  err.response?.data?.name?.[0] ||
                  err.response?.data?.detail ||
                  err.message ||
                  "Failed to create board.";
               setError(msg);
            },
         }
      );
   };

   const handleClose = () => {
      if (createBoardMutation.isPending) return;
      setName("");
      setError(null);
      setVisibility("PRIVATE");
      onClose();
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0 border border-border/80 shadow-2xl bg-card">
            {/* Header */}
            <DialogHeader className="p-5 pb-4 border-b border-border/60 text-left">
               <DialogTitle className="text-lg font-semibold font-display tracking-tight text-foreground flex items-center gap-2.5">
                  <span className="p-1.5 rounded-md bg-primary/10 text-primary">
                     <FolderPlus className="w-4 h-4" />
                  </span>
                  Create New Board
               </DialogTitle>
               <DialogDescription className="text-xs text-muted-foreground mt-1">
                  Organize artworks into a custom board for inspiration or projects.
               </DialogDescription>
            </DialogHeader>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
               {/* Name Input */}
               <div className="space-y-1.5">
                  <Label
                     htmlFor="board-name"
                     className="text-xs font-semibold text-foreground uppercase tracking-wider"
                  >
                     Board Name
                  </Label>
                  <Input
                     id="board-name"
                     placeholder="e.g. Living Room Ideas, Wishlist, Sculptures"
                     value={name}
                     onChange={(e) => {
                        setName(e.target.value);
                        if (error) setError(null);
                     }}
                     autoFocus
                     maxLength={100}
                     className="h-10 text-sm bg-background border-border/80"
                     disabled={createBoardMutation.isPending}
                  />
                  {error && <p className="text-xs text-destructive">{error}</p>}
               </div>

               {/* Privacy Selector */}
               <div className="space-y-2 pt-1">
                  <Label className="text-xs font-semibold text-foreground uppercase tracking-wider">
                     Privacy
                  </Label>
                  <div className="grid grid-cols-2 gap-2 bg-muted/40 p-1 rounded-lg border border-border/60">
                     <button
                        type="button"
                        onClick={() => setVisibility("PRIVATE")}
                        className={cn(
                           "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
                           visibility === "PRIVATE"
                              ? "bg-background text-foreground shadow-xs border border-border font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                        )}
                     >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Private</span>
                        <span className="text-[10px] text-muted-foreground hidden sm:inline">
                           (Only you)
                        </span>
                     </button>

                     <button
                        type="button"
                        onClick={() => setVisibility("PUBLIC")}
                        className={cn(
                           "flex items-center justify-center gap-2 py-2 px-3 rounded-md text-xs font-medium transition-all cursor-pointer",
                           visibility === "PUBLIC"
                              ? "bg-background text-foreground shadow-xs border border-border font-semibold"
                              : "text-muted-foreground hover:text-foreground"
                        )}
                     >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Public</span>
                        <span className="text-[10px] text-muted-foreground hidden sm:inline">
                           (Anyone)
                        </span>
                     </button>
                  </div>
                  <p className="text-[11px] text-muted-foreground px-0.5">
                     {visibility === "PRIVATE"
                        ? "Only you can see this board and its saved artworks."
                        : "Anyone on Artspace can discover and view this board."}
                  </p>
               </div>

               {/* Footer Actions */}
               <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-border/60">
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     onClick={handleClose}
                     disabled={createBoardMutation.isPending}
                     className="px-4 text-xs font-medium"
                  >
                     Cancel
                  </Button>
                  <Button
                     type="submit"
                     size="sm"
                     disabled={createBoardMutation.isPending || !name.trim()}
                     className="px-5 text-xs font-semibold"
                  >
                     {createBoardMutation.isPending && (
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                     )}
                     Create Board
                  </Button>
               </div>
            </form>
         </DialogContent>
      </Dialog>
   );
};
