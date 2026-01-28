'use client'
import ProfileLayoutSkeleton from "@/components/app/profile/profile-layout-skeleton";
import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import { useGetGallery } from "@/features/service/artspace/get-gallery";
import { useParams } from "next/navigation";

const GalleryDetailLayout = ({ children }: { children: React.ReactNode }) => {
  const { id } = useParams();
  const { accessToken } = useAuth()

  const userQuery = useGetGallery({
    galleryId: String(id),
    queryConfig: {
      enabled: id !== undefined,
      refetchOnMount: "always",
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
      href: paths.galleries.detail.getHref(String(user.id)),
      icon: "overview",
    },
    {
      title: "Artworks",
      href: paths.galleries.artworks.getHref(String(user.id)),
      icon: "artworks",
    },
    {
      title: "Collections",
      href: paths.galleries.collections.getHref(String(user.id)),
      icon: "collections",
      disabled: true,
    },
    {
      title: "Like Artworks",
      href: paths.galleries.likedArtworks.getHref(String(user.id)),
      icon: "likes",
    },
    {
      title: "Save",
      href: paths.galleries.save.getHref(String(user.id)),
      icon: "save",
      disabled: true,
    },
  ];

  return <ProfileLayoutView user={user} navLinks={navLinks} >
    {children}
  </ProfileLayoutView>;
};

export default GalleryDetailLayout;
