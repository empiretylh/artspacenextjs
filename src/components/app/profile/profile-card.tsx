import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { useAuth } from "@/features/auth/store";
import { getImage, getUserIcon, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import FollowButton from "../follow-button";
import { paths } from "@/config/paths";

export default function ProfileCard({ user }: { user: User }) {
   const { user: authUser } = useAuth();

   const coverSrc =
      user.profile?.cover_photo
         ? getImage(user.profile.cover_photo)
         : "/assets/profile-cover-default.jpg";

   const avatarSrc =
      user.profile?.profile_picture
         ? getImage(user.profile.profile_picture)
         : "/assets/profile-default.png";

   const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

   return (
      <div className="flex w-full justify-center border border-border/80 rounded-xl overflow-hidden bg-background shadow-xs hover:shadow-sm transition-all duration-300">
         <div className="w-full flex flex-col items-center">
            {/* Cover */}
            <div className="hidden md:block relative aspect-8/3 overflow-hidden w-full">
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

            <div className="mt-3 md:mt-[-32px] flex flex-col items-center pb-4 w-full px-2">
               {/* Avatar */}
               <div className="relative mb-2 w-16 h-16 shrink-0">
                  <AppImage
                     src={avatarSrc}
                     alt={fullName}
                     width={64} // 16 * 4 = 64px
                     height={64}
                     className="rounded-full border-2 border-background object-cover bg-muted"
                  />
               </div>

               {/* Info */}
               <div className="text-center mb-3 w-full">
                  <div className="flex items-center justify-center gap-1.5 mb-1">
                     <Link to={getUserLink(user, authUser!)}>
                        <h2 className="text-sm sm:text-base font-bold hover:underline truncate max-w-[140px] sm:max-w-[180px] font-display tracking-tight text-foreground">
                           {fullName}
                        </h2>
                     </Link>
                     {getUserIcon(user.user_type)}
                  </div>

                  <div className="h-14 sm:h-16 flex items-center justify-center w-full">
                     <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed px-1 mx-auto max-w-[200px]">
                        {user.profile?.bio ? (
                           user.profile.bio
                        ) : (
                           <span className="capitalize text-muted-foreground/75">
                              {user.user_type ? user.user_type.toLowerCase() : "Artist"}
                           </span>
                        )}
                     </p>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-1.5 w-full justify-center items-center flex-wrap">
                  <FollowButton
                     size={"sm"}
                     userId={String(user.id)}
                     userType={user.user_type}
                     following={user.profile?.is_following}
                     className="w-full sm:w-auto rounded-lg text-xs"
                  />
                  {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && (
                     <Link
                        to={`${paths.chats.path}?userId=${user.id}&userType=${user.user_type === 'ARTIST' ? 'artists' : user.user_type === 'GALLERY' ? 'galleries' : 'collectors'}`}
                        className="hidden sm:inline-block"
                     >
                        <Button
                           size="sm"
                           variant="outline"
                           className="text-xs px-2.5 py-1.5 h-8 rounded-lg"
                        >
                           Message
                        </Button>
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
