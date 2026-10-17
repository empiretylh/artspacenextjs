'use client'

import React, { useState } from "react";
import { useProfileUser } from "@/components/providers/profile-user-provider";
import { useGetUserBoards } from "@/features/service/artspace/get-boards";
import { BoardCard } from "@/features/boards/components/board-card";
import { BoardArtworksView } from "@/features/boards/components/board-artworks-view";
import { Bookmark } from "lucide-react";
import type { Board } from "@/types";
import { getUserDisplayName } from "@/lib/utils";

const UserSavePage = () => {
   const { data: user } = useProfileUser();
   const userId = user?.id ? String(user.id) : "";

   const { data: boards = [], isLoading } = useGetUserBoards({
      userId,
      enabled: !!userId,
   });

   const [selectedBoardId, setSelectedBoardId] = useState<string | null>(null);

   const selectedBoard = boards.find((b: Board) => b.id === selectedBoardId) || null;
   const fullName = getUserDisplayName(user);

   if (selectedBoard) {
      return (
         <div className="w-full">
            <BoardArtworksView
               board={selectedBoard}
               onBack={() => setSelectedBoardId(null)}
               isOwner={false}
            />
         </div>
      );
   }

   return (
      <div className="w-full space-y-6">
         {/* Top Header */}
         <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b">
            <div>
               <h1 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground">
                  Boards
               </h1>
               <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Public boards curated by {fullName}.
               </p>
            </div>
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
                     No public boards yet
                  </h3>
                  <p className="text-xs text-muted-foreground">
                     {fullName} hasn't published any public boards.
                  </p>
               </div>
            </div>
         ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
               {boards.map((board: Board) => (
                  <BoardCard
                     key={board.id}
                     board={board}
                     onClick={() => setSelectedBoardId(board.id)}
                  />
               ))}
            </div>
         )}
      </div>
   );
};

export default UserSavePage;
