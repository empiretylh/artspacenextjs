import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";

type EmptyStateProps = {
   title?: string;
   description?: string;
   primaryActionLabel?: string;
   secondaryActionLabel?: string;
   onPrimaryAction?: () => void;
   onSecondaryAction?: () => void;
};

export function EmptyState({
   title = "No data available",
   description = "There’s nothing to display right now.",
   primaryActionLabel,
   secondaryActionLabel,
   onPrimaryAction,
   onSecondaryAction,
}: EmptyStateProps) {
   return (
      <div className="flex h-[360px] items-center justify-center">
         <div className="flex flex-col items-center gap-4 text-center">
            {/* Icon */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
               <Inbox className="h-7 w-7 text-muted-foreground" />
            </div>

            {/* Copy */}
            <div className="space-y-1">
               <h3 className="text-base font-semibold">{title}</h3>
               <p className="max-w-xs text-sm text-muted-foreground">
                  {description}
               </p>
            </div>

            {/* Actions (Optional) */}
            {(onPrimaryAction || onSecondaryAction) && (
               <div className="flex gap-2 pt-2">
                  {onPrimaryAction && (
                     <Button onClick={onPrimaryAction}>
                        {primaryActionLabel}
                     </Button>
                  )}

                  {onSecondaryAction && (
                     <Button variant="outline" onClick={onSecondaryAction}>
                        {secondaryActionLabel}
                     </Button>
                  )}
               </div>
            )}
         </div>
      </div>
   );
}
