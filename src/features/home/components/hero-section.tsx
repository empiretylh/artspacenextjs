import { SectionSubtitle, SectionTitle } from "@/components/common";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import BannerImage from "@/assets/banner.png";
import BannerImageDesktop from "@/assets/banner-desktop.png";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { useIsMobile } from "@/hooks/use-mobile";

const HeroSection = () => {
   const isMobile = useIsMobile();

   return (
      <>
         {isMobile && (
            <div
               className="relative shadow-xl max-w-full overflow-hidden aspect-[2/1] rounded-lg w-full bg-cover bg-center"
               style={{
                  backgroundImage: `url(${BannerImage})`,
               }}
            >
               {/* <div className="absolute inset-0 backdrop-blur flex items-center justify-center text-center">
         <div className="p-4 md:p-8 max-w-4xl space-y-6">
            <SectionTitle className="text-white drop-shadow-lg text-5xl md:text-7xl">
               Discover Art. Own Original.
            </SectionTitle>
            <SectionSubtitle className="text-white/80 drop-shadow">
               Explore curated collections from emerging and established artists
               worldwide. Your next masterpiece awaits.
            </SectionSubtitle>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
               <Link to={paths.artworks.path}>
                  <Button className="text-lg px-8 py-3 h-auto">
                     Shop All Artworks <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
            </div>
         </div>
      </div> */}
            </div>
         )}
         {!isMobile && (
            <div
               className="relative max-w-full overflow-hidden aspect-[8/3] rounded-lg w-full bg-cover bg-center"
               style={{
                  backgroundImage: `url(${BannerImageDesktop})`,
               }}
            >
               {/* <div className="absolute inset-0 backdrop-blur flex items-center justify-center text-center">
         <div className="p-4 md:p-8 max-w-4xl space-y-6">
            <SectionTitle className="text-white drop-shadow-lg text-5xl md:text-7xl">
               Discover Art. Own Original.
            </SectionTitle>
            <SectionSubtitle className="text-white/80 drop-shadow">
               Explore curated collections from emerging and established artists
               worldwide. Your next masterpiece awaits.
            </SectionSubtitle>
            <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
               <Link to={paths.artworks.path}>
                  <Button className="text-lg px-8 py-3 h-auto">
                     Shop All Artworks <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
            </div>
         </div>
      </div> */}
            </div>
         )}
      </>
   );
};

export default HeroSection;
