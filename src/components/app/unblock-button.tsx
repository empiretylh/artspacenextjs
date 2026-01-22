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
   AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/lib/toast";
import { useUnblockUser } from "@/features/service/artspace/unblock-user";
import type { User } from "@/types";

interface UnblockButtonProps {
   label?: string;
   entityType: User["user_type"];
   entityName?: string; // Optional display name
   entityId: string;
   onSuccess?: () => void;
   renderButton?: () => React.ReactNode;
}

export const UnblockButton: React.FC<UnblockButtonProps> = ({
   label = "Unblock",
   entityType,
   entityName,
   entityId,
   onSuccess,
   renderButton,
}) => {
   const unblockUserMutation = useUnblockUser();

   const handleUnblock = async () => {
      unblockUserMutation.mutate({
         userId: entityId,
         userType: entityType,
      });
   };

   return (
      <AlertDialog>
         <AlertDialogTrigger asChild>
            {renderButton ? (
               renderButton()
            ) : (
               <Button variant="outline" size="sm">
                  {label}
               </Button>
            )}
         </AlertDialogTrigger>

         <AlertDialogContent>
            <AlertDialogHeader>
               <AlertDialogTitle>Confirm Unblock</AlertDialogTitle>
               <AlertDialogDescription>
                  Are you sure you want to unblock this {entityType}
                  {entityName ? ` (${entityName})` : ""}? This action can be
                  reversed later from settings.
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
