import { env } from "@/config/env";
import { UserRouteType } from "@/features/service/artspace/get-users";
import UsersPageContainer from "@/features/user/components/users-container";
import UsersListLoading from "@/features/user/components/users-list-loading";
import type { Metadata } from "next";
import { Suspense } from "react";

type UserRouteMeta = {
  title: string;
  description: string;
  ogAlt: string;
  canonical: string;
};

const getUserRouteMeta = (userType: UserRouteType): UserRouteMeta => {
  switch (userType) {
    case "artists":
      return {
        title: "Artists",
        description:
          "Discover Myanmar Art Space artists, explore portfolios, and follow the latest creations.",
        ogAlt: "Artists - Myanmar Art Space",
        canonical: `${env.APP_URL}/artists`,
      };
    case "galleries":
      return {
        title: "Galleries",
        description:
          "Browse galleries on Myanmar Art Space and find spaces showcasing exceptional Myanmar art.",
        ogAlt: "Galleries - Myanmar Art Space",
        canonical: `${env.APP_URL}/galleries`,
      };
    case "collectors":
      return {
        title: "Collectors",
        description:
          "Meet collectors supporting Myanmar Art Space and discover the community behind the collections.",
        ogAlt: "Collectors - Myanmar Art Space",
        canonical: `${env.APP_URL}/collectors`,
      };
    case "buyers":
      return {
        title: "Buyers",
        description:
          "Meet buyers supporting Myanmar Art Space and discover the community behind the collections.",
        ogAlt: "Buyers - Myanmar Art Space",
        canonical: `${env.APP_URL}/buyers`,
      };
    default:
      return {
        title: "Community",
        description:
          "Explore the Myanmar Art Space community and connect with artists, galleries, and collectors.",
        ogAlt: "Community - Myanmar Art Space",
        canonical: `${env.APP_URL}`,
      };
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ userType: UserRouteType }>;
}): Promise<Metadata> {
  const { userType } = await params;
  const routeMeta = getUserRouteMeta(userType);
  const ogImage = `${env.APP_URL}/og-images/opengraph-image.png`;

  return {
    metadataBase: new URL(env.APP_URL),
    title: routeMeta.title,
    description: routeMeta.description,
    alternates: {
      canonical: routeMeta.canonical,
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
      "artists",
      "galleries",
      "collectors",
      "art community",
    ],
    openGraph: {
      type: "website",
      url: routeMeta.canonical,
      title: routeMeta.title,
      description: routeMeta.description,
      siteName: "Myanmar Art Space",
      images: [
        {
          url: ogImage,
          width: 1920,
          height: 1080,
          alt: routeMeta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: routeMeta.title,
      description: routeMeta.description,
      images: [ogImage],
    },
  };
}

const UsersRoute = async ({ params }: { params: Promise<{ userType: string }> }) => {
  const { userType } = await params as { userType: UserRouteType };

  return (
    <Suspense fallback={<UsersListLoading withTitle />}>
      <UsersPageContainer userType={userType} />
    </Suspense >
  );
};

export default UsersRoute;
