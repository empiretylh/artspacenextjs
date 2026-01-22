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
import { useGetCollector } from "@/features/service/artspace/get-collector";
import { useParams } from "next/navigation";

const CollectorDetailLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();

  const userQuery = useGetCollector({
    collectorId: String(id),
    queryConfig: {
      enabled: id !== undefined,
    },
  });

  const user = userQuery.data?.data;

  if (userQuery.isLoading) {
    return <ProfileLayoutSkeleton />;
  }

  if (id === undefined || user === undefined) return <NotFound />;

  const navLinks = [
    {
      title: "Overview",
      href: paths.collectors.detail.getHref(String(user.id)),
      icon: OverviewIcon,
    },
    {
      title: "Artworks",
      href: paths.collectors.artworks.getHref(String(user.id)),
      icon: ArtworksIcon,
    },
    {
      title: "Collections",
      href: paths.collectors.collections.getHref(String(user.id)),
      icon: CollectionIcon,
      disabled: true,
    },
    {
      title: "Like Artworks",
      href: paths.collectors.likedArtworks.getHref(String(user.id)),
      icon: HeartIcon,
    },
    {
      title: "Save",
      href: paths.collectors.save.getHref(String(user.id)),
      icon: BookmarkIcon,
      disabled: true,
    },
  ];

  return <ProfileLayoutView user={user} navLinks={navLinks} >
    {children}
  </ProfileLayoutView>;
};

export default CollectorDetailLayout;
