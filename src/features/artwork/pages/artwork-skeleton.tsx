import { Skeleton } from "@/components/ui/skeleton";
import { ArtworkCharacteristicsCardSkeleton } from "../components/artwork-characteristics-card-skeleton"; // Adjust path if needed
import { ProductInfoCardSkeleton } from "../components/product-info-card-skeleton"; // Adjust path if needed
import { ArtistProfileSkeleton } from "../components/artist-profile-skeleton"; // Adjust path if needed
import ArtworkImageCarouselSkeleton from "../components/artwork-image-carousel-skeleton";

const ArtworkDetailPageSkeleton = () => {
   return (
      <div>
         {/* Page Title Skeleton */}
         <Skeleton className="h-8 w-1/3 mb-4" />

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Left Column Skeletons */}
            <div className="lg:col-span-2 space-y-8">
               {/* Artwork Image Carousel Skeleton */}
               <ArtworkImageCarouselSkeleton />

               {/* Characteristics Card Skeleton */}
               <ArtworkCharacteristicsCardSkeleton />

               {/* Keywords Skeleton */}
               <div>
                  <Skeleton className="h-7 w-32 mb-4" />
                  <div className="flex flex-wrap gap-2">
                     <Skeleton className="h-9 w-24 rounded-lg" />
                     <Skeleton className="h-9 w-28 rounded-lg" />
                     <Skeleton className="h-9 w-20 rounded-lg" />
                     <Skeleton className="h-9 w-32 rounded-lg" />
                  </div>
               </div>

               {/* Description Skeleton */}
               <div>
                  <Skeleton className="h-7 w-36 mb-4" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-[85%]" />
                  </div>
               </div>

               {/* Artist Profile Skeleton */}
               <ArtistProfileSkeleton />
            </div>

            {/* Right Column (Sticky) Skeleton */}
            <div className="lg:col-span-1 space-y-6 sticky top-16 self-start">
               <ProductInfoCardSkeleton />
            </div>
         </div>
      </div>
   );
};

export default ArtworkDetailPageSkeleton;
