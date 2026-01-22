import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { getImage, getUserIcon, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import { UserIcon } from "lucide-react";
import FollowButton from "../follow-button";
import { useAuth } from "@/features/auth/store";
import DefaultProfileImage from "@/assets/profile-default.png";
import DefaultProfileCoverImage from "@/assets/profile-cover-default.png";

export default function ProfileCard({ user }: { user: User }) {
   const { user: authUser } = useAuth();

   return (
      <div className="flex items-center w-full justify-center border rounded-2xl overflow-hidden bg-background">
         <div className="w-full flex flex-col items-center">
            <div className="hidden md:block relative w-full">
               <img
                  src={
                     user?.profile?.cover_photo
                        ? getImage(user?.profile?.cover_photo)
                        : DefaultProfileCoverImage
                  }
                  className="h-[110px] shrink-0 w-full bg-cover"
                  alt={user.first_name + " " + user.last_name + " cover"}
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-background"></div>
            </div>
            <div className="mt-3 md:mt-[-32px] flex flex-col items-center pb-4">
               {/* Avatar Circle */}
               <div className="relative mb-2">
                  <img
                     src={
                        user?.profile?.profile_picture
                           ? getImage(user?.profile?.profile_picture)
                           : DefaultProfileImage
                     }
                     alt={user.first_name + " " + user.last_name}
                     className="w-16 h-16 bg-white rounded-full border-2 border-background object-cover"
                  />
                  {/* <div className="w-16 h-16 rounded-full bg-card border-4 border-background flex items-center justify-center">
                        <UserIcon className="w-8 h-8 text-muted-foreground" />
                     </div> */}
               </div>

               {/* User Info */}
               <div className="text-center mb-2 w-full">
                  {/* Name with Verified Badge */}
                  <div className="flex items-center justify-center gap-1 mb-2">
                     <Link to={getUserLink(user, authUser!)}>
                        <h2 className="text-sm sm:text-base lg:text-lg font-bold hover:underline text-foreground truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px]">
                           {user.first_name + " " + user?.last_name}
                           {getUserIcon(user.user_type)}
                        </h2>
                     </Link>
                  </div>

                  {/* Username */}
                  <p className="text-xs text-muted-foreground mb-1 truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[150px] mx-auto">
                     {user?.email || "@johndoe"}
                  </p>

                  {/* Bio */}
                  <p className="hidden sm:inline text-xs text-muted-foreground truncate max-w-[150px] mx-auto">
                     {user?.profile?.bio || "Digital user and illustrator."}
                  </p>
               </div>

               {/* Action Buttons */}
               <div className="flex gap-1 w-full items-center justify-center flex-wrap">
                  <FollowButton
                     userId={String(user.id)}
                     userType={user.user_type}
                     following={user.profile.is_following}
                     className="w-full sm:w-auto"
                  />
                  <Button
                     disabled
                     size="sm"
                     variant="outline"
                     className="text-xs hidden sm:block px-1 py-2"
                  >
                     Send Message
                  </Button>
               </div>
            </div>
         </div>
      </div>
   );
}
