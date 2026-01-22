import { useAuth } from "@/features/auth/store";
import { cn, getImage, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import Image from "../common/image";
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
            <Image
               src={
                  user.profile.profile_picture
                     ? getImage(user.profile.profile_picture)
                     : "/assets/profile-default.png"
               }
               className="w-10 h-10 shrink-0 aspect-square overflow-hidden rounded-full"
               alt=""
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
