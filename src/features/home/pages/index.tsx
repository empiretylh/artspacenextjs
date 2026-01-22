import HeroSection from "../components/hero-section";
import { FeaturedArtistsSection } from "../components/featured-artists-section";
import { FeaturedArtworksSection } from "../components/featured-artworks-section";
import { GenreSection } from "../components/genre-section";
import { FeaturedGalleriesSection } from "../components/featured-galleries";
import { FeaturedCollectorsSection } from "../components/featured-collectors";
import { CategoryAndStyleSection } from "../components/category-and-style-section";
import { FeaturedEventsSection } from "../components/featured-events-section";
import { FeaturedCollectorsSlider } from "../components/featured-collectors-slider";
import { FeaturedGalleriesSlider } from "../components/featured-galleries-slider copy";
import { FeaturedArtistsSlider } from "../components/featured-artists-slider";

// --- Main App Component ---
export default function HomePage() {
   return (
      <div className="space-y-9">
         <HeroSection />
         <GenreSection />
         <CategoryAndStyleSection />
         <FeaturedEventsSection />
         <FeaturedArtworksSection />
         <FeaturedArtistsSlider />
         <FeaturedGalleriesSlider />
         <FeaturedCollectorsSlider />
         {/* <FeaturedCollectorsSection /> */}
      </div>
   );
}
