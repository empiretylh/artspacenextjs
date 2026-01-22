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
import { useBlockUser } from "@/features/service/artspace/block-user";
import type { User } from "@/types";
import { useAuth } from "@/features/auth/store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

interface BlockButtonProps {
   label?: string;
   entityType: User["user_type"];
   entityName?: string; // Optional display name
   entityId: string;
   onSuccess?: () => void;
   renderButton?: () => React.ReactNode;
}

export const BlockButton: React.FC<BlockButtonProps> = ({
   label = "Block",
   entityType,
   entityName,
   entityId,
   onSuccess,
   renderButton,
}) => {
   const blockUserMutation = useBlockUser();
   const { user } = useAuth();
   const router = useRouter();

   const handleBlock = async () => {
      if (!user) {
         router.push(paths.auth.login.path);
         return;
      }

      blockUserMutation.mutate({
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
               <AlertDialogTitle>Confirm Block</AlertDialogTitle>
               <AlertDialogDescription>
                  Are you sure you want to block this {entityType}
                  {entityName ? ` (${entityName})` : ""}? This action can be
                  reversed later from settings.
               </AlertDialogDescription>
            </AlertDialogHeader>

            <AlertDialogFooter>
               <AlertDialogCancel disabled={blockUserMutation.isPending}>
                  Cancel
               </AlertDialogCancel>
               <AlertDialogAction
                  onClick={handleBlock}
                  disabled={blockUserMutation.isPending}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
               >
                  {blockUserMutation.isPending ? "Blocking..." : "Confirm"}
               </AlertDialogAction>
            </AlertDialogFooter>
         </AlertDialogContent>
      </AlertDialog>
   );
};
