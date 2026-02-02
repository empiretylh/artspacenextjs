import AppImage from "@/components/common/app-image";

const HeroSection = () => {
   return (
      <div className="relative w-full overflow-hidden rounded-lg shadow-xl md:shadow-none aspect-[2/1] md:aspect-[8/3]">
         {/* Mobile Image: Visible only on small screens */}
         <div className="block md:hidden h-full">
            <AppImage
               src="/assets/banner.png"
               alt="Banner mobile"
               fill
               priority // Added for LCP performance
               className="object-cover object-center"
               sizes="(max-width: 768px) 100vw, 0px"
            />
         </div>

         {/* Desktop Image: Visible from medium screens up */}
         <div className="hidden md:block h-full">
            <AppImage
               src="/assets/banner-desktop.png"
               alt="Banner desktop"
               fill
               priority
               className="object-cover object-center"
               sizes="(max-width: 768px) 0px, 100vw"
            />
         </div>
      </div>
   );
};

export default HeroSection;
