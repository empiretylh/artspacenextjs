import Link from "@/components/common/link";
import { getImage, getUserIcon, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import { useAuth } from "@/features/auth/store";
import Image from "../common/image";
import AppImage from "../common/app-image";

export default function UserSmallCard({ user }: { user: User }) {
   const { user: authUser } = useAuth();

   return (
      <div
         className="
         flex flex-col items-center
         w-[90px] sm:w-[110px] md:w-[130px]
        bg-background
         p-2 sm:p-3
      "
      >
         {/* Avatar */}
         <Link to={getUserLink(user, authUser!)} className="mb-2">
            <AppImage
               src={
                  user?.profile?.profile_picture
                     ? getImage(user.profile.profile_picture)
                     : "/assets/profile-default.png"
               }
               alt={`${user.first_name} ${user.last_name}`}
               // Use fixed dimensions for small, consistent icons
               width={56}
               height={56}
               className="rounded-full object-cover w-14 h-14"
            />
         </Link>

         {/* Name */}
         <div
            className="
            flex flex-col items-center gap-1
            max-w-[70px] sm:max-w-[80px] md:max-w-[110px]
         "
         >
            <Link to={getUserLink(user, authUser!)}>
               <p
                  className="
                  text-sm md:text-base
                  font-semibold text-center
                  max-w-[100px]
                  hover:underline
               "
               >
                  {user.first_name} {user.last_name}
               </p>
            </Link>

            {/* <div className="text-xs sm:text-sm">
               {getUserIcon(user.user_type)}
            </div> */}
         </div>
      </div>
   );
}
