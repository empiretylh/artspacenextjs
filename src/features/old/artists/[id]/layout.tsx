import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { getCachedArtist } from "@/features/service/artspace/get-artist";

const ArtistDetailLayout = async ({ params, children }: { params: Promise<{ id: string }>, children: React.ReactNode }) => {
  const { id } = await params;

  const user = await getCachedArtist(String(id));

  if (id === undefined || user === undefined) return <NotFound />;

  const navLinks = [
    {
      title: "Overview",
      href: paths.artists.detail.getHref(String(user.id)),
      icon: "overview",
    },
    {
      title: "Artworks",
      href: paths.artists.artworks.getHref(String(user.id)),
      icon: "artworks",
    },
    {
      title: "Collections",
      href: paths.artists.collections.getHref(String(user.id)),
      icon: "collections",
      disabled: true,
    },
    {
      title: "Like Artworks",
      href: paths.artists.likedArtworks.getHref(String(user.id)),
      icon: "likes",
    },
    {
      title: "Save",
      href: paths.artists.save.getHref(String(user.id)),
      icon: "save",
      disabled: true,
    },
  ];

  return <ProfileLayoutView user={user} navLinks={navLinks} >
    {children}
  </ProfileLayoutView>;
};

export default ArtistDetailLayout;
