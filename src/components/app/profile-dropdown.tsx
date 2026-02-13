import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
               className="relative border h-8 w-8 rounded-full"
            >
               <Avatar className="h-8 w-8">
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
               {/* <DropdownMenuItem asChild>
                  <Link to={paths.profile.path}>
                     Profile
                     <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                  </Link>
               </DropdownMenuItem> */}
               <DropdownMenuItem asChild>
                  <Link to={paths.profile.path}>
                     Profile
                     {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </Link>
               </DropdownMenuItem>
               <DropdownMenuItem asChild>
                  <Link to={paths.settings.path}>
                     Settings
                     {/* <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut> */}
                  </Link>
               </DropdownMenuItem>
               {/* <DropdownMenuItem asChild disabled>
                  <Link to="/settings">
                     Settings
                     <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                  </Link>
               </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
               onClick={handleLogout}
            >
               Log out
               {/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
