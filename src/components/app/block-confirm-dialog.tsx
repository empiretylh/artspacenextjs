'use client'
import React, { RefObject, useState } from "react";
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
import { getUserRouteType } from "@/lib/utils";
import { profileAnalytics, UserType } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

interface BlockConfirmDialogProps {
   label?: string;
   entityType: User["user_type"];
   entityName?: string; // Optional display name
   openConfirmDialog?: boolean;
   onOpenConfirmDialogChange?: (open: boolean) => void;
   entityId: string;
   onSuccess?: () => void;
   reFocusRef: RefObject<HTMLDivElement | null>;
}

export const BlockConfirmDialog: React.FC<BlockConfirmDialogProps> = ({
   label = "Block",
   entityType,
   entityName,
   entityId,
   openConfirmDialog = false,
   onOpenConfirmDialogChange,
   reFocusRef,
   onSuccess,
}) => {
   const { source } = useSource();
   const blockUserMutation = useBlockUser({
      mutationConfig: {
         onSuccess: () => {
            profileAnalytics.block(entityId, entityType.toLocaleLowerCase() as UserType, source);
            onSuccess?.();
         },
      }
   });
   const { user } = useAuth();
   const router = useRouter();

   const handleBlock = async () => {
      if (!user) {
         router.push(paths.auth.login.path);
         return;
      }

      blockUserMutation.mutate({
         userId: entityId,
         userType: getUserRouteType(entityType),
      });
   };

   return (
      <AlertDialog open={openConfirmDialog} onOpenChange={onOpenConfirmDialogChange}>
         <AlertDialogContent onCloseAutoFocus={(e) => {
            requestAnimationFrame(() => reFocusRef.current?.focus());
         }}>
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
      </AlertDialog >
   );
};
