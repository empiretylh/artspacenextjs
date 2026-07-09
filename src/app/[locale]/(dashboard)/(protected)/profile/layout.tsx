'use client'
import ProfileLayoutSkeleton from "@/components/app/profile/profile-layout-skeleton";
import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { useGetProfile } from "@/features/profile/api/get-profile";
import { getUserRouteType } from "@/lib/utils";

const ProfileDetailLayout = ({ children }: { children: React.ReactNode }) => {
  const profileQuery = useGetProfile();

  const profile = profileQuery.data?.data;

  if (profileQuery.isLoading) {
    return <ProfileLayoutSkeleton />;
  }

  if (profile === undefined) return <NotFound />;

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

  return (
    <ProfileLayoutView userType={getUserRouteType(profile.user_type)} variant="profile" user={profile} navLinks={navLinks} >
      {children}
    </ProfileLayoutView>
  );
};

export default ProfileDetailLayout;
