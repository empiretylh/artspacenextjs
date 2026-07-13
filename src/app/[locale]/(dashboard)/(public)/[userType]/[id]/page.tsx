export const revalidate = 60;

import { env } from "@/config/env";
import UserOverviewPage from "@/features/user/pages/user-overview-page";
import { getCachedUser } from "@/features/service/artspace/get-user";
import { getUsersOg, UserRouteType } from "@/features/service/artspace/get-users";
import { getImage, getUserRouteType } from "@/lib/utils";
import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export async function generateStaticParams() {
  const artists = await getUsersOg("artists", { limit: 10 })
  const galleries = await getUsersOg("galleries", { limit: 10 })
  const collectors = await getUsersOg("collectors", { limit: 10 })
  // const buyers = await getUsersOg("BUYER", { limit: 10 })

  const allUsers = [...artists.results, ...galleries.results, ...collectors.results];

  return routing.locales.flatMap((locale) =>
    allUsers.map((user) => ({
      locale,
      userType: getUserRouteType(user.user_type),
      id: String(user.id),
    }))
  )
}

type Props = {
  params: Promise<{ locale: string; userType: UserRouteType; id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userType, id } = await params;

  // fetch post information
  const data = await getCachedUser(id, userType);
  const displayName = `${data.first_name || ""} ${data.last_name || ""}`.trim();
  const title = displayName || "User Profile";
  const description =
    data.profile.bio || `Explore ${displayName || "this"} profile on Myanmar Art Space.`;
  const canonical = `${env.APP_URL}/${userType}/${id}`;
  const ogImage = getImage(data.profile.profile_picture) || "/assets/profile-default.png";

  return {
    metadataBase: new URL(env.APP_URL),
    title,
    description,
    alternates: {
      canonical,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    keywords: [
      "Myanmar Art Space",
      userType,
      displayName || "artist",
      "profile",
      "art community",
    ],
    openGraph: {
      type: "profile",
      url: canonical,
      title,
      description,
      siteName: "Myanmar Art Space",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${title} - Myanmar Art Space`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

const UserDetailRoute = async ({
  params,
}: {
  params: Promise<{ locale: string }>
}) => {
  const { locale } = await params;
  setRequestLocale(locale);
  return <UserOverviewPage />
};

export default UserDetailRoute;
