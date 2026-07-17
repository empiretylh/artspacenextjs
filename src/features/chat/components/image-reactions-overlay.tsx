import { cn } from "@/lib/utils";
import type { ChatUser } from "../types";
import { useAuth } from "@/features/auth/store";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface ImageReactionsOverlayProps {
   reactions: Record<string, string>;
   participantDetails?: Record<string, ChatUser>;
   onReact: (emoji: string) => void;
   className?: string;
}

export const ImageReactionsOverlay = ({ 
   reactions, 
   participantDetails, 
   onReact,
   className
}: ImageReactionsOverlayProps) => {
   const { user } = useAuth();
   
   if (!reactions || Object.keys(reactions).length === 0) return null;

   // Group reactions by emoji: { "❤️": ["uid1", "uid2"], "👍": ["uid3"] }
   const grouped = Object.entries(reactions).reduce((acc, [userId, emoji]) => {
      if (!acc[emoji]) acc[emoji] = [];
      acc[emoji].push(userId);
      return acc;
   }, {} as Record<string, string[]>);

   return (
      <div className={cn("flex flex-wrap gap-1 bg-black/40 backdrop-blur-xs p-1 rounded-lg border border-white/10 select-none", className)}>
         {Object.entries(grouped).map(([emoji, userIds]) => {
            const hasReacted = userIds.includes(String(user?.id));
            
            // Build names list for tooltip
            const namesList = userIds.map(uid => {
               if (uid === String(user?.id)) return "You";
               return participantDetails?.[uid]?.name || "Someone";
            });
            
            let tooltipText = "";
            if (namesList.length === 1) {
               tooltipText = `${namesList[0]}`;
            } else if (namesList.length === 2) {
               tooltipText = `${namesList[0]} and ${namesList[1]}`;
            } else {
               tooltipText = `${namesList.slice(0, -1).join(", ")}, and ${namesList[namesList.length - 1]}`;
            }
            
            return (
               <Tooltip key={emoji}>
                  <TooltipTrigger asChild>
                     <button
                        onClick={(e) => {
                           e.stopPropagation();
                           onReact(emoji);
                        }}
                        className={cn(
                           "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[10px] transition-colors select-none text-white hover:scale-105 active:scale-95 cursor-pointer",
                           hasReacted 
                              ? "bg-white/25 hover:bg-white/30 border border-white/20" 
                              : "bg-transparent hover:bg-white/10 border border-transparent"
                        )}
                     >
                        <span className="text-xs leading-none">{emoji}</span>
                        <span className="font-semibold text-[9px] leading-none">{userIds.length}</span>
                     </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs">
                     {tooltipText}
                  </TooltipContent>
               </Tooltip>
            );
         })}
      </div>
   );
};
