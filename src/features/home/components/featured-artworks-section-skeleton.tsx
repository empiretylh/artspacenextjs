import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedArtworksSectionSkeleton = () => {
   const skeletonCards = Array.from({ length: 8 }); // Number of placeholder cards

   return (
      <section className="space-y-6">
         {/* Header skeleton */}
         <div className="flex justify-between items-center">
            <div>
               <Skeleton className="h-8 w-44 rounded-sm" /> {/* SectionTitle */}
               <Skeleton className="h-4 w-64 rounded-sm mt-2" /> {/* Subtitle */}
            </div>
            <div className="flex gap-2">
               <div className="hidden md:flex items-center">
                  <Skeleton className="h-8 w-24 rounded-sm" /> {/* View All Button */}
               </div>
               <div className="flex gap-1">
                  <div className="h-8 w-8 rounded-full border flex items-center justify-center opacity-50">
                     <ChevronLeft className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="h-8 w-8 rounded-full border flex items-center justify-center opacity-50">
                     <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
               </div>
            </div>
         </div>

         {/* Horizontal Scroll / Swiper skeleton */}
         <div className="-mx-4 md:mx-0 overflow-hidden">
            <div className="flex gap-3 sm:gap-4 lg:gap-5 xl:gap-6 px-4 md:px-0">
               {skeletonCards.map((_, index) => (
                  <div
                     key={index}
                     className="w-[calc((100%-12px)/2.2)] sm:w-[calc((100%-32px)/3.2)] lg:w-[calc((100%-64px)/4.2)] xl:w-[calc((100%-100px)/5.2)] flex-shrink-0"
                  >
                     {/* Artwork Image Container */}
                     <Skeleton className="aspect-square w-full rounded-sm" />

                     {/* Info Container */}
                     <div className="pt-3 space-y-1.5">
                        <div className="space-y-1">
                           <Skeleton className="h-4 w-3/4 rounded-sm" /> {/* Title */}
                           <Skeleton className="h-3 w-1/2 rounded-sm" /> {/* Artist */}
                        </div>
                        <div className="flex items-center gap-1.5">
                           <Skeleton className="h-4 w-12 rounded-full" /> {/* Category */}
                           <Skeleton className="h-3 w-10 rounded-sm" /> {/* Dimensions */}
                        </div>
                        <Skeleton className="h-5 w-16 rounded-sm pt-0.5" /> {/* Price */}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};
