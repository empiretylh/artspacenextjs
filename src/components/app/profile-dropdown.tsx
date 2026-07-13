import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuGroup,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import Link from "../common/link";
import { useGetProfile } from "@/features/profile/api/get-profile";
import { getImage } from "@/lib/utils";
import { getQueryClient } from "@/lib/get-query-client";
import { useRouter } from "next/navigation";

export function ProfileDropdown() {
   const { logout, accessToken } = useAuth();
   const profileQuery = useGetProfile({
      queryConfig: {
         enabled: !!accessToken
      }
   });
   const router = useRouter();
   const user = profileQuery.data?.data;

   async function handleLogout() {
      const queryClient = getQueryClient();
      await useAuth.getState().logout();

      queryClient.cancelQueries();
      queryClient.clear();

      router.replace(paths.auth.login.path);
      router.refresh();
   }

   return (
      <DropdownMenu modal={false}>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               className="relative border h-10 w-10 md:h-8 md:w-8 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95 cursor-pointer select-none"
            >
               <Avatar className="h-10 w-10 md:h-8 md:w-8">
                  {user?.profile.profile_picture ? (
                     <AvatarImage
                        src={getImage(user?.profile.profile_picture)}
                        alt={user.first_name + " " + user?.last_name}
                     />
                  ) : (
                     <AvatarFallback>
                        {user?.first_name.charAt(0)}
                        {user?.last_name.charAt(0)}
                     </AvatarFallback>
                  )}
               </Avatar>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
               <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                     {user?.first_name + " " + user?.last_name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                     {user?.email}
                  </p>
               </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
               <DropdownMenuItem asChild>
                  <Link to={paths.profile.path} className="flex items-center gap-2 cursor-pointer w-full">
                     <User className="h-4 w-4 text-muted-foreground" />
                     <span>Profile</span>
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link to={paths.settings.path} className="flex items-center gap-2 cursor-pointer w-full">
                     <Settings className="h-4 w-4 text-muted-foreground" />
                     <span>Settings</span>
                  </Link>
               </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               onClick={handleLogout}
               className="flex items-center gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
            >
               <LogOut className="h-4 w-4 text-destructive" />
               <span>Log out</span>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
