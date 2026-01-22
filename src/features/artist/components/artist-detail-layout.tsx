import ProfileLayoutSkeleton from "@/components/app/profile/profile-layout-skeleton";
import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import HeartIcon from "@/components/icons/heart-icon";
import OverviewIcon from "@/components/icons/overview-icon";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { useGetArtist } from "@/features/service/artspace/get-artist";
import { useParams } from "react-router";

const ArtistDetailLayout = () => {
   const { id } = useParams();

   const userQuery = useGetArtist({
      artistId: String(id),
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
         href: paths.artists.detail.getHref(String(user.id)),
         icon: OverviewIcon,
      },
      {
         title: "Artworks",
         href: paths.artists.artworks.getHref(String(user.id)),
         icon: ArtworksIcon,
      },
      {
         title: "Collections",
         href: paths.artists.collections.getHref(String(user.id)),
         icon: CollectionIcon,
         disabled: true,
      },
      {
         title: "Like Artworks",
         href: paths.artists.likedArtworks.getHref(String(user.id)),
         icon: HeartIcon,
      },
      {
         title: "Save",
         href: paths.artists.save.getHref(String(user.id)),
         icon: BookmarkIcon,
         disabled: true,
      },
   ];

   return <ProfileLayoutView user={user} navLinks={navLinks} />;
};

export default ArtistDetailLayout;
