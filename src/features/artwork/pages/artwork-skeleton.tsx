import { Skeleton } from "@/components/ui/skeleton";
import { ArtworkCharacteristicsCardSkeleton } from "../components/artwork-characteristics-card-skeleton";
import { ProductInfoCardSkeleton } from "../components/product-info-card-skeleton";
import { ArtistProfileSkeleton } from "../components/artist-profile-skeleton";
import ArtworkImageCarouselSkeleton from "../components/artwork-image-carousel-skeleton";

const ArtworkDetailPageSkeleton = () => {
   return (
      <div className="pb-12">
         {/* Navigation & Header Skeleton */}
         <div className="mb-5 space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-1">
               <Skeleton className="h-4 w-40" />
               <Skeleton className="h-9 w-2/3 max-w-md" />
            </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Left Column Skeletons */}
            <div className="lg:col-span-2 space-y-6">
               {/* Artwork Image Skeleton */}
               <ArtworkImageCarouselSkeleton />

               {/* Mobile Product Info Skeleton */}
               <div className="block lg:hidden">
                  <ProductInfoCardSkeleton />
               </div>

               {/* Description Skeleton */}
               <div className="space-y-2">
                  <Skeleton className="h-7 w-36" />
                  <div className="space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-[75%]" />
                  </div>
               </div>

               {/* Characteristics Card Skeleton */}
               <ArtworkCharacteristicsCardSkeleton />

               {/* Keywords Skeleton */}
               <div className="space-y-2">
                  <Skeleton className="h-7 w-28" />
                  <div className="flex flex-wrap gap-2">
                     <Skeleton className="h-8 w-20 rounded-full" />
                     <Skeleton className="h-8 w-24 rounded-full" />
                     <Skeleton className="h-8 w-16 rounded-full" />
                     <Skeleton className="h-8 w-28 rounded-full" />
                  </div>
               </div>

               {/* Artist Profile Skeleton */}
               <ArtistProfileSkeleton />
            </div>

            {/* Right Column (Sticky) Skeleton */}
            <div className="hidden lg:block lg:col-span-1 space-y-6 sticky top-20 self-start">
               <ProductInfoCardSkeleton />
            </div>
         </div>
      </div>
   );
};

export default ArtworkDetailPageSkeleton;
