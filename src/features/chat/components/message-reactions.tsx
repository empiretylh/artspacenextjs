import { cn } from "@/lib/utils";
import type { Message, ChatUser } from "../types";
import { useAuth } from "@/features/auth/store";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MessageReactionsProps {
   message: Message;
   participantDetails?: Record<string, ChatUser>;
   onReact: (emoji: string) => void;
   isMine: boolean;
}

export const MessageReactions = ({ message, participantDetails, onReact, isMine }: MessageReactionsProps) => {
   const { user } = useAuth();
   if (!message.reactions || Object.keys(message.reactions).length === 0) return null;

   // Group reactions by emoji: { "❤️": ["uid1", "uid2"], "👍": ["uid3"] }
   const grouped = Object.entries(message.reactions).reduce((acc, [userId, emoji]) => {
      if (!acc[emoji]) acc[emoji] = [];
      acc[emoji].push(userId);
      return acc;
   }, {} as Record<string, string[]>);

   return (
      <div className={cn("flex flex-wrap gap-1 mt-1 px-1", isMine ? "justify-end" : "justify-start")}>
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
                           "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs border transition-colors select-none",
                           isMine
                              ? (hasReacted 
                                 ? "bg-primary-foreground/25 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/30" 
                                 : "bg-primary-foreground/10 border-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/15")
                              : (hasReacted 
                                 ? "bg-primary/10 border-primary/20 text-primary hover:bg-primary/15" 
                                 : "bg-muted/40 border-border/40 text-muted-foreground hover:bg-muted")
                        )}
                     >
                        <span className="text-sm">{emoji}</span>
                        <span className="font-semibold text-[10px]">{userIds.length}</span>
                     </button>
                  </TooltipTrigger>
                  <TooltipContent side="top" className="text-xs max-w-xs">
                     {tooltipText}
                  </TooltipContent>
               </Tooltip>
            );
         })}
      </div>
   );
};
