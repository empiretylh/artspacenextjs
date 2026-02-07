import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/store";
import { getImage, getUserIcon, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import FollowButton from "../follow-button";

export default function ProfileCard({ user }: { user: User }) {
   const { user: authUser } = useAuth();

   const coverSrc =
      user.profile?.cover_photo
         ? getImage(user.profile.cover_photo)
         : "/assets/profile-cover-default.png";

   const avatarSrc =
      user.profile?.profile_picture
         ? getImage(user.profile.profile_picture)
         : "/assets/profile-default.png";

   const fullName = `${user.first_name} ${user.last_name}`;

   return (
      <div className="flex w-full justify-center border rounded-xl overflow-hidden bg-background">
         <div className="w-full flex flex-col items-center">
            {/* Cover */}
            <div className="hidden md:block relative aspect-8/3 overflow-hidden w-full">
               {/* <img
                  src={coverSrc}
                  alt={`${fullName} cover`}
                  className="absolute inset-0 w-full h-full object-cover"
               /> */}
               <AppImage
                  src={coverSrc}
                  alt={`${fullName} cover`}
                  width={800}
                  height={300}
                  // On desktop, cards are usually in a grid. 
                  // Adjust 350px to match your actual card's max-width.
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-background" />
            </div>

            <div className="mt-3 md:mt-[-32px] flex flex-col items-center pb-4 w-full">
               {/* Avatar */}
               <div className="relative mb-2 w-16 h-16">
                  {/* <img
                     src={avatarSrc}
                     alt={fullName}
                     className="w-full h-full rounded-full border-2 border-background object-cover bg-white"
                  /> */}
                  <AppImage
                     src={avatarSrc}
                     alt={fullName}
                     width={64} // 16 * 4 = 64px
                     height={64}
                     className="rounded-full border-2 border-background object-cover bg-white"
                  />
               </div>

               {/* Info */}
               <div className="text-center px-2 mb-2 w-full">
                  <div className="flex items-center justify-center gap-1/2 mb-2">
                     <Link to={getUserLink(user, authUser!)}>
                        <h2 className="text-sm sm:text-base lg:text-lg font-bold hover:underline truncate max-w-20 lg:max-w-32.5">
                           {fullName}
                        </h2>
                     </Link>
                     {getUserIcon(user.user_type)}
                  </div>

                  <p className="text-xs text-muted-foreground mb-1 truncate max-w-20 lg:max-w-32.5 mx-auto min-h-[16px]">
                     {user.email}
                  </p>

                  <p className="hidden sm:block text-xs text-muted-foreground truncate max-w-20 lg:max-w-32.5 mx-auto min-h-[16px]">
                     {user.profile?.bio}
                  </p>
               </div>

               {/* Actions */}
               <div className="flex gap-1 px-2 w-full justify-center flex-wrap min-h-[36px]">
                  <FollowButton
                     size={"sm"}
                     userId={String(user.id)}
                     userType={user.user_type}
                     following={user.profile.is_following}
                     className="w-full sm:w-auto rounded-lg"
                  />
                  <Button
                     disabled
                     size="sm"
                     variant="outline"
                     className="hidden sm:block text-xs px-1 py-2 rounded-lg"
                  >
                     Send Message
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
