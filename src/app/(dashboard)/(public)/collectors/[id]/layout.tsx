'use client'
import ProfileLayoutSkeleton from "@/components/app/profile/profile-layout-skeleton";
import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import { useGetCollector } from "@/features/service/artspace/get-collector";
import { useParams } from "next/navigation";

const CollectorDetailLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { accessToken } = useAuth()

  const userQuery = useGetCollector({
    collectorId: String(id),
    queryConfig: {
      enabled: id !== undefined,
    },
  });

  const user = userQuery.data;

  if (userQuery.isLoading || accessToken === undefined) {
    return <ProfileLayoutSkeleton />;
  }

  if (id === undefined || user === undefined) return <NotFound />;

  const navLinks = [
    {
      title: "Overview",
      href: paths.collectors.detail.getHref(String(user.id)),
      icon: "overview",
    },
    {
      title: "Artworks",
      href: paths.collectors.artworks.getHref(String(user.id)),
      icon: "artworks",
    },
    {
      title: "Collections",
      href: paths.collectors.collections.getHref(String(user.id)),
      icon: "collections",
      disabled: true,
    },
    {
      title: "Like Artworks",
      href: paths.collectors.likedArtworks.getHref(String(user.id)),
      icon: "likes",
    },
    {
      title: "Save",
      href: paths.collectors.save.getHref(String(user.id)),
      icon: "save",
      disabled: true,
    },
  ];

  return <ProfileLayoutView user={user} navLinks={navLinks} >
    {children}
  </ProfileLayoutView>;
};

export default CollectorDetailLayout;
