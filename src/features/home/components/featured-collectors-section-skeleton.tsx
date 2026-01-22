import ProfileCardSkeleton from "@/components/app/profile/profile-card-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedCollectorsSectionSkeleton = () => {
   // Number of placeholder cards
   const skeletonCards = Array.from({ length: 6 });

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

         {/* Grid of artist cards */}
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6 gap-4">
            {skeletonCards.map((_, index) => (
               <ProfileCardSkeleton key={index} />
            ))}
         </div>
      </section>
   );
};
