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

export const ProfilePage: React.FC = () => {
   const getProfile = useGetProfile();
   const changeProfilePictureMutation = useChangeProfilePicture();
   const user = getProfile?.data?.data;
   const router = useRouter();
   const profileInput = useRef<HTMLInputElement>(null);

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
   const {
      email,
      first_name,
      last_name,
      user_type,
      profile: { bio, profile_picture, website },
   } = user;

   const fullName =
      `${first_name || ""} ${last_name || ""}`.trim() || "Unnamed User";

   return (
      <div className="container">
         <Card className="relative border border-border shadow-md">
            {/* ✏️ Edit (pen) button */}
            <Button
               variant="ghost"
               size="icon"
               className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
               onClick={() => router.push(paths.dashboard.profileEdit.path)}
               title="Edit Profile"
            >
               <Pencil className="w-4 h-4" />
            </Button>

            <CardHeader className="flex flex-col items-center space-y-4">
               {/* Avatar */}
               <Avatar
                  className="w-24 h-24 cursor-pointer hover:border-2 hover:border-primary transition-all"
                  onClick={() => profileInput.current?.click()}
               >
                  {profile_picture ? (
                     <AvatarImage src={profile_picture} alt={fullName} />
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

               <div className="text-center space-y-1">
                  <CardTitle className="text-2xl font-semibold">
                     {fullName}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">{email}</p>
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-muted text-sm mt-2">
                     <UserCircle2 className="w-4 h-4" />
                     <span>{user_type}</span>
                  </div>
               </div>
            </CardHeader>

            <CardContent className="space-y-6 mt-4">
               {/* Bio */}
               <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                     Bio
                  </h3>
                  <p className="text-sm">
                     {bio ? (
                        bio
                     ) : (
                        <span className="text-muted-foreground">
                           No bio added yet.
                        </span>
                     )}
                  </p>
               </div>

               {/* Website */}
               <div>
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-1">
                     Website
                  </h3>
                  {website ? (
                     <a
                        href={
                           website.startsWith("http")
                              ? website
                              : `https://${website}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline text-sm"
                     >
                        <Globe className="w-4 h-4" /> {website}
                     </a>
                  ) : (
                     <p className="text-sm text-muted-foreground">
                        No website provided.
                     </p>
                  )}
               </div>
            </CardContent>
         </Card>
      </div>
   );
};
