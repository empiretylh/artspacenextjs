import ProfileCardSkeleton from "@/components/app/profile/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedArtistsSectionSkeleton = () => {
   // Number of placeholder cards
   const skeletonCards = Array.from({ length: 6 });

   return (
      <section className="space-y-6">
         {/* Header skeleton */}
         <div className="flex justify-between items-center">
            <div>
               <Skeleton className="h-8 w-32 rounded-sm" /> {/* SectionTitle */}
               <Skeleton className="h-4 w-60 rounded-sm mt-2" /> {/* Subtitle */}
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
         <div className="overflow-hidden">
            <div className="flex gap-2">
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
