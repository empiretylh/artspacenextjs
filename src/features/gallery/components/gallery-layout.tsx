import ProfileLayoutSkeleton from "@/components/app/profile/profile-layout-skeleton";
import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import HeartIcon from "@/components/icons/heart-icon";
import OverviewIcon from "@/components/icons/overview-icon";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { useGetGallery } from "@/features/service/artspace/get-gallery";
import { useParams } from "react-router";

const GalleryDetailLayout = () => {
   const { id } = useParams();

   const userQuery = useGetGallery({
      galleryId: String(id),
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
         href: paths.galleries.detail.getHref(String(user.id)),
         icon: OverviewIcon,
      },
      {
         title: "Artworks",
         href: paths.galleries.artworks.getHref(String(user.id)),
         icon: ArtworksIcon,
      },
      {
         title: "Collections",
         href: paths.galleries.collections.getHref(String(user.id)),
         icon: CollectionIcon,
         disabled: true,
      },
      {
         title: "Liked Artworks",
         href: paths.galleries.likedArtworks.getHref(String(user.id)),
         icon: HeartIcon,
      },
      {
         title: "Save",
         href: paths.galleries.save.getHref(String(user.id)),
         icon: BookmarkIcon,
         disabled: true,
      },
   ];

   return <ProfileLayoutView user={user} navLinks={navLinks} />;
};

export default GalleryDetailLayout;
