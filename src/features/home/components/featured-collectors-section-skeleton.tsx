import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const FeaturedCollectorsSectionSkeleton = () => {
   // Number of placeholder cards
   const skeletonCards = Array.from({ length: 10 });

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

         {/* Horizontal Scroll Area skeleton */}
         <div className="-mx-4 md:mx-0 overflow-hidden">
            <div className="flex gap-2 px-4 md:px-0">
               {skeletonCards.map((_, index) => (
                  <div
                     key={index}
                     className="flex flex-col items-center w-[96px] sm:w-[110px] md:w-[130px] p-2 sm:p-3 flex-shrink-0"
                  >
                     {/* Avatar */}
                     <Skeleton className="w-14 h-14 rounded-full mb-2" />
                     {/* Name */}
                     <Skeleton className="h-4 w-14 sm:w-16 rounded-sm mb-1" />
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
};
