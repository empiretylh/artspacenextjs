import LoadingPage from "@/components/page/loading-page";
import { env } from "@/config/env";
import SearchPage from "@/features/search/pages/search-page";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL(env.APP_URL),
  title: "Search Results",
  description: "Search artworks, artists, galleries, and collectors on Myanmar Art Space.",
  alternates: {
    canonical: `${env.APP_URL}/search`,
  },
};

const SearchPageRoute = () => {
  return (
    <Suspense fallback={<LoadingPage />}>
      <SearchPage />
    </Suspense>
  );
};

export default SearchPageRoute;
