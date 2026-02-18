import React, { useState } from "react";
import {
   AlertDialog,
   AlertDialogAction,
   AlertDialogCancel,
   AlertDialogContent,
   AlertDialogDescription,
   AlertDialogFooter,
   AlertDialogHeader,
   AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useUnblockUser } from "@/features/service/artspace/unblock-user";
import type { User } from "@/types";
import { userAnalytics, UserType } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

interface UnblockUserDialogProps {
   entityType: User["user_type"];
   entityName?: string; // Optional display name
   entityId: string;
   open: boolean;
   setOpen: (open: boolean) => void;
}

export const UnblockUserDialog: React.FC<UnblockUserDialogProps> = ({
   entityType,
   entityName,
   entityId,
   open,
   setOpen,
}) => {
   const { source } = useSource();
   const unblockUserMutation = useUnblockUser({
      mutationConfig: {
         onSuccess: () => {
            userAnalytics.unblock(entityId, entityType.toLocaleLowerCase() as UserType, source);
         },
      }
   });

   const handleUnblock = async () => {
      unblockUserMutation.mutate({
         userId: entityId,
         userType: entityType,
      });
   };

   return (
      <AlertDialog open={open} onOpenChange={setOpen}>
         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Confirm Unblock</AlertDialogTitle>
               <AlertDialogDescription>
                  Are you sure you want to unblock this {entityType}
                  {entityName ? ` (${entityName})` : ""}?
               </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
               <AlertDialogCancel disabled={unblockUserMutation.isPending}>
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleUnblock}
                  disabled={unblockUserMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
               >
                  {unblockUserMutation.isPending ? "Unblocking..." : "Confirm"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
