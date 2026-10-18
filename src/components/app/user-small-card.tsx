import Link from "@/components/common/link";
import { getImage, getUserDisplayName, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import { useAuth } from "@/features/auth/store";
import AppImage from "../common/app-image";

export default function UserSmallCard({ user }: { user: User }) {
   const { user: authUser } = useAuth();
   const fullName = getUserDisplayName(user);

   return (
      <div
         className="
            flex flex-col items-center
            w-[96px] sm:w-[110px] md:w-[130px]
            p-2 sm:p-3
            rounded-xl hover:bg-muted/50 transition-colors duration-200
            group
         "
      >
         {/* Avatar */}
         <Link to={getUserLink(user, authUser!)} className="mb-2 no-underline hover:no-underline">
            <div className="relative rounded-full ring-2 ring-border/80 group-hover:ring-primary/50 transition-all duration-300">
               <AppImage
                  src={
                     user?.profile?.profile_picture
                        ? getImage(user.profile.profile_picture)
                        : "/assets/profile-default.png"
                  }
                  alt={fullName}
                  width={56}
                  height={56}
                  className="rounded-full object-cover w-14 h-14"
               />
            </div>
         </Link>

         {/* Name */}
         <div className="flex flex-col items-center gap-1 w-full min-w-0">
            <Link to={getUserLink(user, authUser!)} className="no-underline hover:no-underline w-full">
               <p
                  className="
                     text-xs sm:text-sm
                     font-semibold text-center
                     truncate text-foreground group-hover:text-primary transition-colors
                     font-display tracking-tight
                  "
                  title={fullName}
               >
                  {fullName}
               </p>
            </Link>
         </div>
      </div>
   );
}
