import { FeaturedArtworksSection } from "../components/featured-artworks-section";
import { GenreSection } from "../components/genre-section";
import { CategoryAndStyleSection } from "../components/category-and-style-section";
import { FeaturedEventsSection } from "../components/featured-events-section";
import { FeaturedCollectorsSlider } from "../components/featured-collectors-slider";
import { FeaturedGalleriesSlider } from "../components/featured-galleries-slider";
import { FeaturedArtistsSlider } from "../components/featured-artists-slider";
import { SectionLazyLoader } from "../components/section-lazy-loader";
import { FeaturedArtistsSectionSkeleton } from "../components/featured-artists-section-skeleton";
import { FeaturedEventsSectionSkeleton } from "../components/featured-events-section-skeleton";
import { FeaturedArtworksSectionSkeleton } from "../components/featured-artworks-section-skeleton";
import { FeaturedGalleriesSectionSkeleton } from "../components/featured-galleries-section-skeleton";
import { FeaturedCollectorsSectionSkeleton } from "../components/featured-collectors-section-skeleton";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/get-query-client";
import BannerSliderContainer from "../components/banner-slider-container";
import { MasIntroBanner } from "../components/mas-intro-banner";

// --- Main App Component ---
export default async function HomePage() {
   const queryClient = getQueryClient();

   // Prefetch only essential content
   // (Artworks, Artists, Events, etc. will be fetched on the client side with skeletons)

   return (
      <div className="space-y-9">
         <BannerSliderContainer />
         <MasIntroBanner />
         {/* <HeroSection /> */}
         <GenreSection />
         <CategoryAndStyleSection />
         <HydrationBoundary state={dehydrate(queryClient)}>
            <SectionLazyLoader skeleton={<FeaturedArtistsSectionSkeleton />}>
               <FeaturedArtistsSlider />
            </SectionLazyLoader>

            <SectionLazyLoader skeleton={<FeaturedEventsSectionSkeleton />}>
               <FeaturedEventsSection />
            </SectionLazyLoader>

            <SectionLazyLoader skeleton={<FeaturedArtworksSectionSkeleton />}>
               <FeaturedArtworksSection />
            </SectionLazyLoader>

            <SectionLazyLoader skeleton={<FeaturedGalleriesSectionSkeleton />}>
               <FeaturedGalleriesSlider />
            </SectionLazyLoader>

            <SectionLazyLoader skeleton={<FeaturedCollectorsSectionSkeleton />}>
               <FeaturedCollectorsSlider />
            </SectionLazyLoader>
         </HydrationBoundary>
         {/* <FeaturedCollectorsSection /> */}
      </div >
   );
}
