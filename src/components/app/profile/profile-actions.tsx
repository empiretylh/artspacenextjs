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
import { ReportUserDialog } from "../report-user-dialog";

export function ProfileActions({ user, blocked }: { user: User, blocked: boolean | undefined }) {
   const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
   const [openReportDialog, setOpenReportDialog] = useState(false);
   const reFocusRef = useRef<any>(null);

   const displayName =
      `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
      user.username ||
      user.email;

   return (
      <>
         <BlockConfirmDialog
            reFocusRef={reFocusRef}
            entityType={user.user_type}
            openConfirmDialog={openConfirmDialog}
            onOpenConfirmDialogChange={setOpenConfirmDialog}
            entityId={String(user.id)}
         />
         <ReportUserDialog
            open={openReportDialog}
            onOpenChange={setOpenReportDialog}
            userId={user.id}
            userName={displayName}
         />
         <DropdownMenu>
            <DropdownMenuTrigger asChild>
               <Button ref={reFocusRef} variant="outline" className="rounded-full h-8 w-8 text-muted-foreground p-0">
                  <MoreVertical className="h-4 w-4" />
               </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
               {!blocked && (
                  <DropdownMenuItem onClick={() => setOpenConfirmDialog(true)}>
                     Block
                  </DropdownMenuItem>
               )}
               <DropdownMenuItem onClick={() => setOpenReportDialog(true)}>
                  Report
               </DropdownMenuItem>
            </DropdownMenuContent>
         </DropdownMenu>
      </>
   );
}
