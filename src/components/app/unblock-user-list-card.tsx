import { useAuth } from "@/features/auth/store";
import { cn, getImage, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import AppImage from "../common/app-image";
import Link from "../common/link";
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";

const UnblockUserListCard = ({
   user,
   border = false,
   className,
   onClick,
}: {
   border?: boolean;
   user: User;
   className?: string;
   onClick?: () => void;
}) => {
   const { setOpenMobile } = useSidebar();
   const { user: authUser } = useAuth();

   return (
      <div
         className={cn(
            "flex py-2 gap-2 w-full justify-between items-center ",
            border && "border px-2 rounded-lg",
            className
         )}
      >
         <div className="flex items-center shrink gap-2 min-w-0">
            <AppImage
               src={
                  user.profile.profile_picture
                     ? getImage(user.profile.profile_picture)
                     : "/assets/profile-default.png"
               }
               width={40}
               height={40}
               containerClassName="shrink-0"
               className="w-10 h-10 shrink-0 aspect-square overflow-hidden rounded-full"
               alt={user.first_name + " " + user.last_name}
            />

            {/* Name + email block */}
            <div className="flex flex-col min-w-0">
               <Link
                  onClick={() => setOpenMobile(false)}
                  to={getUserLink(user, authUser!)}
               >
                  <h3 className="text-sm font-medium truncate hover:underline">
                     {user.first_name + " " + user.last_name}
                  </h3>
               </Link>
               <p className="text-xs text-muted-foreground truncate">
                  {user.email}
               </p>
            </div>
         </div>

         <Button
            onClick={() => {
               onClick?.();
            }}
            variant="outline"
            size="sm"
         >
            Unblock
         </Button>
      </div>
   );
};

export default UnblockUserListCard;
