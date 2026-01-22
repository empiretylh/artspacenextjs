import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import type { User } from "@/types";
import { BlockButton } from "../block-button";

export function ProfileActions({ user }: { user: User }) {
   return (
      <DropdownMenu>
         <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
               <MoreVertical className="h-4 w-4" />
            </Button>
         </DropdownMenuTrigger>

         <DropdownMenuContent align="end">
            {user.profile && !user.profile.isBlocked && (
               <DropdownMenuItem asChild>
                  <BlockButton
                     entityType={user.user_type}
                     entityId={String(user.id)}
                     renderButton={() => (
                        <Button
                           variant="ghost"
                           size="sm"
                           className="w-full justify-start"
                        >
                           Block
                        </Button>
                     )}
                  />
               </DropdownMenuItem>
            )}
            <DropdownMenuItem disabled>Report</DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
