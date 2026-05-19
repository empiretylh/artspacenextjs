import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedArtworksSectionSkeleton = () => {
   const skeletonCards = Array.from({ length: 6 }); // Number of placeholder cards

   return (
      <section>
         {/* Header skeleton */}
         <div className="flex justify-between items-end mb-8">
            <div>
               <Skeleton className="h-8 w-48 rounded" /> {/* SectionTitle */}
            </div>
            <div className="hidden sm:flex">
               <Skeleton className="h-8 w-32 rounded" /> {/* Button */}
            </div>
         </div>

         {/* Navigation buttons skeleton */}
         <div className="flex gap-2 mb-4">
            <Skeleton className="h-10 w-10 rounded" /> {/* Prev */}
            <Skeleton className="h-10 w-10 rounded" /> {/* Next */}
         </div>

         {/* Horizontal Scroll / Swiper skeleton */}
         <div className="flex gap-4 overflow-hidden px-4 md:px-0">
            {skeletonCards.map((_, index) => (
               <div key={index} className="flex-shrink-0 w-[140px] md:w-[180px]">
                  <Skeleton className="aspect-square w-full rounded-sm mb-2" />{" "}
                  {/* Artwork image */}
                  <Skeleton className="h-4 w-3/4 rounded-sm mb-1" /> {/* Title */}
                  <Skeleton className="h-3 w-1/2 rounded-sm" />{" "}
                  {/* Artist/Category */}
               </div>
            ))}
         </div>
      </section>
   );
};
