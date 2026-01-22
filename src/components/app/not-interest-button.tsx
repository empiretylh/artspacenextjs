import { Button } from "../ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useInterestEvent } from "@/features/service/artspace/interest-event";
import { cn } from "@/lib/utils";
import { ChevronDownIcon } from "lucide-react";

const NotInterestEventButton = ({
   eventId,
   size = "sm",
   className,
   interested,
}: {
   eventId: string;
   size?: "sm" | "default" | "lg" | "icon" | null | undefined;
   className?: string;
   interested: boolean;
}) => {
   const interestEventMutation = useInterestEvent();

   const handleInterestEvent = () => {
      interestEventMutation.mutate({ eventId, interested: false });
   };

   return (
      <DropdownMenu>
         <DropdownMenuTrigger>
            <Button
               variant="default"
               //  onClick={handleInterestEvent}
               size={size}
               disabled={interestEventMutation.isPending}
               className={cn("flex items-center gap-2", className)}
            >
               <span
                  className={cn("truncate", size === "sm" && "text-xs")}
               ></span>
               Interested <ChevronDownIcon className="size-4 opacity-50" />
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end">
            <DropdownMenuItem className="bg-primary text-primary-foreground focus:text-primary-foreground focus:bg-primary/90">
               Interested
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleInterestEvent}>
               Not interested
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
};

export default NotInterestEventButton;
