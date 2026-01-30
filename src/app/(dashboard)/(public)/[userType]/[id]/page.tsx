export const revalidate = 60;

import UserOverviewPage from "@/features/user/pages/user-overview-page";
import { getCachedUser } from "@/features/service/artspace/get-user";
import { getUsersOg, UserRouteType } from "@/features/service/artspace/get-users";
import { getImage } from "@/lib/utils";
import { Metadata, ResolvingMetadata } from "next";
import { User } from "@/types";

export async function generateStaticParams() {
  const artists = await getUsersOg("artists", { limit: 10 })
  const galleries = await getUsersOg("galleries", { limit: 10 })
  const collectors = await getUsersOg("collectors", { limit: 10 })
  // const buyers = await getUsersOg("BUYER", { limit: 10 })

  const allUsers = [...artists.results, ...galleries.results, ...collectors.results];

  return allUsers.map((user) => ({
    id: String(user.id),
  }))
}

type Props = {
  params: Promise<{ userType: UserRouteType, id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { userType, id } = await params;

  // fetch post information
  const data = await getCachedUser(id, userType);

  return {
    title: (data.first_name || '') + (data.last_name || ''),
    description: data.profile.about,
    openGraph: {
      images: [getImage(data.profile.profile_picture) || '/assets/profile-default.png'],
      title: (data.first_name || '') + (data.last_name || ''),
      description: data.profile.about,
    }
  }
}

const UserDetailRoute = async () => {
  return <UserOverviewPage />
};

export default UserDetailRoute;
