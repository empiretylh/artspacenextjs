import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import type { User } from "@/types";
import { BlockConfirmDialog } from "../block-confirm-dialog";
import { useRef, useState } from "react";

export function ProfileActions({ user, blocked }: { user: User, blocked: boolean | undefined }) {
   const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
   const reFocusRef = useRef<any>(null)

   return (
      <>
         <BlockConfirmDialog reFocusRef={reFocusRef} entityType={user.user_type} openConfirmDialog={openConfirmDialog} onOpenConfirmDialogChange={setOpenConfirmDialog}
            entityId={String(user.id)} />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button ref={reFocusRef} variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
               {!blocked && (
                  <DropdownMenuItem onClick={() => setOpenConfirmDialog(true)}>
                     Block
                  </DropdownMenuItem>
               )}
               <DropdownMenuItem disabled>Report</DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
}
