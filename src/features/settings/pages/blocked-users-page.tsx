import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/types";
import BlockedUsersListContainer from "../components/blocked-users-list-container";

export function BlockedUsersPage() {
   return (
      <div className="mx-auto space-y-6">
         <div>
            <h1 className="text-2xl font-semibold">Blocked Users</h1>
            <p className="text-sm text-muted-foreground">
               You will not see content from users you’ve blocked. You can
               unblock them at any time.
            </p>
         </div>

         <Separator />

         <BlockedUsersListContainer />
      </div>
   );
}
