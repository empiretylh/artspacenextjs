import ProfileCardSkeleton from "@/components/app/profile/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedArtistsSectionSkeleton = () => {
   // Number of placeholder cards
   const skeletonCards = Array.from({ length: 6 });

   return (
      <section>
         {/* Header skeleton */}
         <div className="flex justify-between items-end mb-4">
            <div>
               <Skeleton className="h-8 w-32 rounded" /> {/* SectionTitle */}
            </div>
            <Skeleton className="h-8 w-24 rounded" /> {/* View All Button */}
         </div>
         <div className="flex gap-2 mb-4">
            <div className="h-10 w-10 rounded border flex items-center justify-center opacity-50">
               <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="h-10 w-10 rounded border flex items-center justify-center opacity-50">
               <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
         </div>

         {/* Horizontal Scroll / Swiper skeleton */}
         <div className="-mx-4 md:mx-0 overflow-hidden">
            <div className="flex gap-2 px-4 md:px-0">
               {skeletonCards.map((_, index) => (
                  <div
                     key={index}
                     className="w-[calc((100%-16px)/3)] lg:w-[calc((100%-24px)/4)] xl:w-[calc((100%-32px)/5)] 2xl:w-[calc((100%-40px)/6)] flex-shrink-0"
                  >
                     <ProfileCardSkeleton />
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};
