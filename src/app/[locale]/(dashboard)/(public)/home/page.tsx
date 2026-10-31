export const revalidate = 60;

import type { Metadata } from "next";
import HomePage from "@/features/home/pages";
import { HomeSeenTracker } from "@/features/home/components/home-seen-tracker";

/**
 * SEO: Explicitly declare the canonical URL as the root domain ('/')
 * and instruct search engines not to index '/home' as a duplicate page.
 */
export const metadata: Metadata = {
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/",
  },
};

/**
 * Explicit Home page route (/home):
 * Always renders the HomePage when the user explicitly navigates to Home.
 */
export default function ExplicitHomePageRoute() {
  return (
    <>
      <HomeSeenTracker />
      <HomePage />
    </>
  );
}
