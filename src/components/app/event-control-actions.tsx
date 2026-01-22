import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Edit, Mail, MoreVertical, Trash } from "lucide-react";

export function EventControlActions({
   onUpdateButtonClick,
   onDeleteButtonClick,
   onInviteButtonClick,
}: {
   onUpdateButtonClick: (event: any) => void;
   onDeleteButtonClick: (event: any) => void;
   onInviteButtonClick: (event: any) => void;
}) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
               <MoreVertical className="h-4 w-4 text-foreground" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end">
            <DropdownMenuItem asChild>
               <Button
                  size="sm"
                  variant="ghost"
                  className="p-1 text-foreground w-full justify-start"
                  onClick={onInviteButtonClick}
               >
                  <Mail className="w-4 h-4" /> Invite
               </Button>
            </DropdownMenuItem>
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
