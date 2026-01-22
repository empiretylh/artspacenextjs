import React, { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserCircle2, Globe, User, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { useGetProfile } from "../api/get-profile";
import LoadingPage from "@/components/page/loading-page";
import { useChangeProfilePicture } from "../api/change-profile-picture";
import { getImage } from "@/lib/utils";
import { useChangeProfileCover } from "../api/change-profile-cover";
import Image from "@/components/common/image";

export const ProfileMedia: React.FC = () => {
   const getProfile = useGetProfile();
   const changeProfilePictureMutation = useChangeProfilePicture();
   const changeProfileCoverMutation = useChangeProfileCover();
   const user = getProfile?.data?.data;
   const profileInput = useRef<HTMLInputElement>(null);
   const bannerInput = useRef<HTMLInputElement>(null);

   if (getProfile.isLoading) {
      return <LoadingPage />;
   }

   if (!user) {
      return <div>Profile not found</div>;
   }

   const onProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         changeProfilePictureMutation.mutate({
            data: {
               profile_picture: file,
            },
         });
      }
   };

   const onBannerInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
         changeProfileCoverMutation.mutate({
            data: {
               cover_photo: file,
            },
         });
      }
   };

   const {
      email,
      first_name,
      last_name,
      user_type,
      profile: { bio, profile_picture, website, cover_photo },
   } = user;

   const fullName =
      `${first_name || ""} ${last_name || ""}`.trim() || "Unnamed User";

   return (
      <div className="space-y-4">
         <div className="flex gap-6">
            <div className="relative inline-block border rounded-full">
               <Avatar className="w-24 h-24">
                  {profile_picture ? (
                     <AvatarImage
                        src={getImage(profile_picture)}
                        alt={fullName}
                     />
                  ) : (
                     <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                        {first_name?.[0]?.toUpperCase() || <User />}
                     </AvatarFallback>
                  )}
                  <input
                     ref={profileInput}
                     type="file"
                     className="hidden"
                     onChange={onProfilePictureChange}
                  />
               </Avatar>
               <Button
                  variant="default"
                  size="icon"
                  className="absolute rounded-full bottom-1 -right-2 border-white border text-muted-foreground hover:text-primary"
                  // onClick={() => router.push(paths.dashboard.profileEdit.path)}
                  title="Edit Profile"
                  disabled={changeProfilePictureMutation.isPending}
                  loading={changeProfilePictureMutation.isPending}
                  onClick={() => profileInput.current?.click()}
               >
                  {changeProfilePictureMutation.isPending ? (
                     <></>
                  ) : (
                     <Pencil className="w-4 text-white h-4" />
                  )}
               </Button>
            </div>

            <div className="space-y-1">
               <h1 className="text-2xl font-semibold">{fullName}</h1>
               <p className="text-sm text-muted-foreground">{email}</p>
               <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm mt-2">
                  <UserCircle2 className="w-4 h-4" />
                  <span>{user_type}</span>
               </div>
            </div>
         </div>
         <div className="relative">
            <Image
               src={cover_photo ? getImage(cover_photo) : ""}
               className="aspect-[3/1] w-full rounded-2xl"
               alt=""
            />
            <input
               ref={bannerInput}
               type="file"
               className="hidden"
               onChange={onBannerInputChange}
            />
            <Button
               variant="default"
               size="icon"
               className="absolute rounded-full bottom-4 right-4 border-white border text-muted-foreground hover:text-primary"
               // onClick={() => router.push(paths.dashboard.profileEdit.path)}
               title="Edit Profile"
               disabled={changeProfileCoverMutation.isPending}
               loading={changeProfileCoverMutation.isPending}
               onClick={() => bannerInput.current?.click()}
            >
               {changeProfileCoverMutation.isPending ? (
                  <></>
               ) : (
                  <Pencil className="w-4 text-white h-4" />
               )}
            </Button>
         </div>
      </div>
   );
};
