import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, MoreVertical, Trash } from "lucide-react";

export function ArtworkControlActions({
   onUpdateButtonClick,
   onDeleteButtonClick,
}: {
   onUpdateButtonClick: (artwork: any) => void;
   onDeleteButtonClick: (artwork: any) => void;
}) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
               <MoreVertical className="h-4 w-4 text-white" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
               <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 text-foreground w-full justify-start"
                  onClick={onUpdateButtonClick}
               >
                  <Edit className="w-4 h-4" /> Edit
               </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
               <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 text-foreground w-full justify-start"
                  onClick={onDeleteButtonClick}
               >
                  <Trash className="w-4 h-4" /> Delete
               </Button>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
