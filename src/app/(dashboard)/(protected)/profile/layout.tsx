'use client'
import ProfileLayoutSkeleton from "@/components/app/profile/profile-layout-skeleton";
import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import HeartIcon from "@/components/icons/heart-icon";
import OverviewIcon from "@/components/icons/overview-icon";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { useGetProfile } from "@/features/profile/api/get-profile";
import { ClipboardPenLineIcon } from "lucide-react";

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
      icon: OverviewIcon,
    },
    {
      title: "Artworks",
      href: paths.profile.artworks.path,
      icon: ArtworksIcon,
    },
    {
      title: "Events",
      href: paths.profile.events.path,
      icon: ClipboardPenLineIcon,
    },
    {
      title: "Collections",
      href: paths.profile.collections.path,
      icon: CollectionIcon,
      disabled: true,
    },
    {
      title: "Like artworks",
      href: paths.profile.likedArtworks.path,
      icon: HeartIcon,
    },
    {
      title: "Save",
      href: paths.profile.save.path,
      icon: BookmarkIcon,
      disabled: true,
    },
  ];

  return (
    <ProfileLayoutView variant="profile" user={profile} navLinks={navLinks} >
      {children}
    </ProfileLayoutView>
  );
};

export default ProfileDetailLayout;
