import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedEventsSectionSkeleton = () => {
   return (
      <div className="space-y-6">
         {/* Header skeleton */}
         <div className="flex justify-between items-center">
            <div>
               <Skeleton className="h-8 w-40 rounded-sm" /> {/* SectionTitle */}
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
         <div className="-mx-4 md:mx-0 overflow-hidden">
            <div className="flex gap-3 sm:gap-4 lg:gap-5 xl:gap-6 px-4 md:px-0">
               {Array.from({ length: 4 }).map((_, i) => (
                  <div
                     key={i}
                     className="w-[calc((100%-12px)/1.2)] sm:w-[calc((100%-16px)/2.2)] lg:w-[calc((100%-36px)/2.8)] xl:w-[calc((100%-60px)/3.5)] flex-shrink-0 space-y-3"
                  >
                     <Skeleton className="h-40 md:h-48 w-full rounded-sm" />
                     <div className="space-y-2">
                        <Skeleton className="h-6 w-3/4 rounded-sm" />
                        <div className="space-y-1">
                           <Skeleton className="h-3 w-12 rounded-sm" />
                           <Skeleton className="h-4 w-1/2 rounded-sm" />
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
};
