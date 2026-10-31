export const revalidate = 60;

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "@/i18n/routing";
import HomePage from "@/features/home/pages";
import { RootHomeClientGate } from "./root-home-client-gate";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

type Props = {
  params: Promise<{ locale: string }>;
};

/**
 * Root index route (default route when entering domain):
 * - If user is returning (has seen the home page before), server redirects to /artworks.
 * - If user is new or a search engine crawler, renders HomePage and initializes the seen state.
 */
export default async function HomePageRoute({ params }: Props) {
  const { locale } = await params;
  const cookieStore = await cookies();
  const hasSeenHome = cookieStore.get("artspace_home_seen")?.value === "true";

  if (hasSeenHome) {
    redirect({ href: "/artworks", locale });
  }

  return (
    <>
      <RootHomeClientGate />
      <HomePage />
    </>
  );
}
