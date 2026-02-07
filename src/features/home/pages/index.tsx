export const revalidate = 60

import HeroSection from "../components/hero-section";
import { FeaturedArtworksSection } from "../components/featured-artworks-section";
import { GenreSection } from "../components/genre-section";
import { CategoryAndStyleSection } from "../components/category-and-style-section";
import { FeaturedEventsSection } from "../components/featured-events-section";
import { FeaturedCollectorsSlider } from "../components/featured-collectors-slider";
import { FeaturedGalleriesSlider } from "../components/featured-galleries-slider";
import { FeaturedArtistsSlider } from "../components/featured-artists-slider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getEvents } from "@/features/service/artspace/get-events";
import { queryKeys } from "@/config/query-keys";
import { getArtworks } from "@/features/service/artspace/get-artworks";
import { getArtists } from "@/features/service/artspace/get-artists";
import { getGalleries } from "@/features/service/artspace/get-galleries";
import { getCollectors } from "@/features/service/artspace/get-collectors";
import { getQueryClient } from "@/lib/get-query-client";
import BannerSliderContainer from "../components/banner-slider-container";

// --- Main App Component ---
export default async function HomePage() {
   // const queryClient = getQueryClient();

   // await queryClient.prefetchQuery({
   //    queryKey: queryKeys.event.list({ limit: 3 }),
   //    queryFn: () => getEvents({ limit: 3 }),
   // });

   // await queryClient.prefetchQuery({
   //    queryKey: queryKeys.artwork.list({ limit: 10 }),
   //    queryFn: () => getArtworks({ limit: 10 }),
   // });

   // await queryClient.prefetchQuery({
   //    queryKey: queryKeys.artist.list({ limit: 10 }),
   //    queryFn: () => getArtists({ limit: 10 }),
   // });

   // await queryClient.prefetchQuery({
   //    queryKey: queryKeys.gallery.list({ limit: 10 }),
   //    queryFn: () => getGalleries({ limit: 10 }),
   // });

   // await queryClient.prefetchQuery({
   //    queryKey: queryKeys.collector.list({ limit: 10 }),
   //    queryFn: () => getCollectors({ limit: 10 }),
   // });

   return (
      <div className="space-y-9">
         <BannerSliderContainer />
         {/* <HeroSection /> */}
         <GenreSection />
         <CategoryAndStyleSection />
         <FeaturedArtistsSlider />
         <FeaturedEventsSection />
         <FeaturedArtworksSection />
         <FeaturedGalleriesSlider />
         <FeaturedCollectorsSlider />
         {/* <HydrationBoundary state={dehydrate(queryClient)}> */}
         {/* </HydrationBoundary> */}
         {/* <FeaturedCollectorsSection /> */}
      </div>
   );
}
