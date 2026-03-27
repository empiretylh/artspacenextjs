import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import { paths } from "@/config/paths";
import { useGetProfile } from "../api/get-profile";
import { getUserRouteType } from "@/lib/utils";
import type { UserRouteType } from "@/features/service/artspace/get-users";

const ProfileDetailLayout = ({ children }: { children: React.ReactNode }) => {
   const { data } = useGetProfile();

   const profile = data?.data;
   const userType = profile?.user_type
      ? (getUserRouteType(profile.user_type) as UserRouteType)
      : undefined;

   const navLinks = [
      {
         title: "Overview",
         href: paths.profile.path,
         icon: "overview",
      },
      {
         title: "Artworks",
         href: paths.profile.artworks.path,
         icon: "artworks",
      },
      {
         title: "Events",
         href: paths.profile.events.path,
         icon: "events",
      },
      {
         title: "Collections",
         href: paths.profile.collections.path,
         icon: "collections",
         disabled: true,
      },
      {
         title: "Like artworks",
         href: paths.profile.likedArtworks.path,
         icon: "likes",
      },
      {
         title: "Save",
         href: paths.profile.save.path,
         icon: "save",
         disabled: true,
      },
   ];

   if (!profile || !userType) {
      return null;
   }

   return (
      <ProfileLayoutView
         variant="profile"
         user={profile}
         userType={userType}
         navLinks={navLinks}
      >
         {children}
      </ProfileLayoutView>
   );
};

export default ProfileDetailLayout;
