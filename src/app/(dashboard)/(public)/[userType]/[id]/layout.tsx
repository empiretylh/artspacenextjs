import ProfileLayoutView from "@/components/app/profile/profile-layout-view";
import NotFound from "@/components/layout/not-found";
import { paths } from "@/config/paths";
import { getCachedUser } from "@/features/service/artspace/get-user";
import { UserRouteType } from "@/features/service/artspace/get-users";

const UserDetailLayout = async ({ params, children }: { params: Promise<{ userType: UserRouteType, id: string }>, children: React.ReactNode }) => {
  const { userType, id } = await params;

  const user = await getCachedUser(String(id), userType);

  const pathKey = userType;

  if (id === undefined || user === undefined) return <NotFound />;

  const navLinks = [
    {
      title: "Overview",
      href: paths[pathKey].detail.getHref(String(user.id)),
      icon: "overview",
    },
    {
      title: "Artworks",
      href: paths[pathKey].artworks.getHref(String(user.id)),
      icon: "artworks",
    },
    {
      title: "Collections",
      href: paths[pathKey].collections.getHref(String(user.id)),
      icon: "collections",
      disabled: true,
    },
    {
      title: "Like Artworks",
      href: paths[pathKey].likedArtworks.getHref(String(user.id)),
      icon: "likes",
    },
    {
      title: "Save",
      href: paths[pathKey].save.getHref(String(user.id)),
      icon: "save",
      disabled: true,
    },
  ];

  return <ProfileLayoutView userType={userType} user={user} navLinks={navLinks} >
    {children}
  </ProfileLayoutView>;
};

export default UserDetailLayout;
