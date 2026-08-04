import { cn } from "@/lib/utils";
import type { Message, ChatUser } from "../types";
import { useAuth } from "@/features/auth/store";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

interface MessageReactionsProps {
   message: Message;
   participantDetails?: Record<string, ChatUser>;
   onReact: (emoji: string, imageIndex?: number) => void;
   isMine: boolean;
}

interface ReactionOccurrence {
   userId: string;
   target: 'message' | number;
}

export const MessageReactions = ({ message, participantDetails, onReact, isMine }: MessageReactionsProps) => {
   const { user } = useAuth();

   const allReactions: Record<string, ReactionOccurrence[]> = {};

   // 1. Message-level reactions
   if (message.reactions) {
      Object.entries(message.reactions).forEach(([userId, emoji]) => {
         if (!allReactions[emoji]) allReactions[emoji] = [];
         allReactions[emoji].push({ userId, target: 'message' });
      });
   }

   // 2. Image-level reactions
   if (message.mediaReactions) {
      Object.entries(message.mediaReactions).forEach(([indexStr, userMap]) => {
         const imageIndex = Number(indexStr);
         Object.entries(userMap).forEach(([userId, emoji]) => {
            if (!allReactions[emoji]) allReactions[emoji] = [];
            allReactions[emoji].push({ userId, target: imageIndex });
         });
      });
   }

   if (Object.keys(allReactions).length === 0) return null;

   return (
      <div className={cn("flex flex-wrap gap-1 mt-1 px-1", isMine ? "justify-end" : "justify-start")}>
         {Object.entries(allReactions).map(([emoji, occurrences]) => {
            const hasMyReaction = occurrences.some(occ => occ.userId === String(user?.id));

            // Tooltip preview text (e.g. "You on message, Someone on image 1")
            const tooltipParts = occurrences.map(({ userId, target }) => {
               const name = userId === String(user?.id) ? "You" : (participantDetails?.[userId]?.name || "Someone");
               const location = target === 'message' ? "message" : `image ${target + 1}`;
               return `${name} on ${location}`;
            });
            const tooltipText = tooltipParts.join(", ");

            // Group detailed view by target for popover
            const targetGroups: Record<string, { names: string[], userIds: string[] }> = {};
            occurrences.forEach(({ userId, target }) => {
               const label = target === 'message' ? "Message" : `Image ${target + 1}`;
               if (!targetGroups[label]) {
                  targetGroups[label] = { names: [], userIds: [] };
               }
               const name = userId === String(user?.id) ? "You" : (participantDetails?.[userId]?.name || "Someone");
               targetGroups[label].names.push(name);
               targetGroups[label].userIds.push(userId);
            });

            return (
               <Tooltip key={emoji}>
                  <Popover>
                     <PopoverTrigger asChild>
                        <TooltipTrigger asChild>
                           <button
                              onClick={(e) => {
                                 e.stopPropagation();
                              }}
                              className={cn(
                                 "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-colors select-none cursor-pointer",
                                 isMine
                                    ? (hasMyReaction 
                                       ? "bg-primary-foreground/25 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30" 
                                       : "bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/15")
                                    : (hasMyReaction 
                                       ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/15" 
                                       : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted")
                              )}
                           >
                              <span className="text-sm">{emoji}</span>
                              <span className="font-semibold text-[10px]">{occurrences.length}</span>
                           </button>
                        </TooltipTrigger>
                     </PopoverTrigger>
                     
                     <PopoverContent 
                        side="top" 
                        align="center" 
                        className="w-56 p-2 text-xs bg-background/95 backdrop-blur-md shadow-md border animate-in fade-in-50 slide-in-from-bottom-1 z-50 pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                     >
                        <div className="font-semibold mb-1.5 text-muted-foreground border-b pb-1">
                           Reaction breakdown for {emoji}
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                           {Object.entries(targetGroups).map(([targetLabel, data]) => {
                              const targetValue = targetLabel === "Message" ? undefined : (parseInt(targetLabel.replace("Image ", "")) - 1);
                              const hasReactedToThis = data.userIds.includes(String(user?.id));
                              return (
                                 <div 
                                    key={targetLabel} 
                                    onClick={(e) => {
                                       e.stopPropagation();
                                       onReact(emoji, targetValue);
                                    }}
                                    className={cn(
                                       "flex flex-col p-1 rounded-sm cursor-pointer hover:bg-muted transition-colors",
                                       hasReactedToThis && "bg-primary/5 hover:bg-primary/10 border border-primary/10"
                                    )}
                                    title={hasReactedToThis ? "Click to remove your reaction" : "Click to react here"}
                                 >
                                    <div className="flex items-center justify-between">
                                       <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                                          {targetLabel}
                                       </span>
                                       {hasReactedToThis && (
                                          <span className="text-[9px] text-primary font-semibold">
                                             (Click to remove)
                                          </span>
                                       )}
                                    </div>
                                    <div className="text-foreground pl-1 text-[11px]">
                                       {data.names.join(", ")}
                                    </div>
                                 </div>
                              );
                           })}
                        </div>
                     </PopoverContent>
                  </Popover>
                  <TooltipContent side="top" className="text-xs max-w-xs">
                     {tooltipText}
                  </TooltipContent>
               </Tooltip>
            );
         })}
      </div>
   );
};
