import { Skeleton } from "@/components/ui/skeleton";

export const FeaturedEventsSectionSkeleton = () => {
   return (
      <div className="space-y-6">
         <div className="flex justify-between items-center px-4 md:px-0">
            <div className="space-y-2">
               <Skeleton className="h-8 w-48" />
               <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
               <Skeleton className="h-8 w-24 hidden md:block" />
               <div className="flex gap-1">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
               </div>
            </div>
         </div>
         <div className="flex gap-4 overflow-hidden px-4 md:px-0">
            {[...Array(3)].map((_, i) => (
               <div key={i} className="min-w-[240px] md:min-w-[300px] flex-1 space-y-4">
                  <Skeleton className="h-40 md:h-48 w-full rounded-sm" />
                  <div className="space-y-2">
                     <Skeleton className="h-6 w-3/4 rounded-sm" />
                     <Skeleton className="h-4 w-1/2 rounded-sm" />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};
