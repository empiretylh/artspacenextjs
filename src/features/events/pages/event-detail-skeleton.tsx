import { Skeleton } from "@/components/ui/skeleton";

export const EventDetailPageSkeleton = () => {
   return (
      <div className="pb-24 sm:pb-16 animate-pulse">
         {/* Hero Banner Skeleton */}
         <Skeleton className="w-screen md:w-full ml-[50%] translate-x-[-50%] aspect-[4/3] sm:aspect-video md:aspect-[2/1] min-h-[320px] sm:min-h-0 max-h-[90dvh]" />

         {/* 2-Column Content Skeleton */}
         <div className="mx-auto mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-10">
               <div className="space-y-3">
                  <Skeleton className="h-6 w-28" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
               </div>

               <div className="space-y-4">
                  <Skeleton className="h-6 w-36" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     <Skeleton className="h-16 rounded-xl" />
                     <Skeleton className="h-16 rounded-xl" />
                  </div>
               </div>

               <div className="space-y-4">
                  <Skeleton className="h-6 w-40" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                     <Skeleton className="aspect-square rounded-lg" />
                     <Skeleton className="aspect-square rounded-lg" />
                     <Skeleton className="aspect-square rounded-lg" />
                  </div>
               </div>
            </div>

            {/* Right Column Sticky */}
            <div className="lg:col-span-1 space-y-4">
               <Skeleton className="h-64 rounded-xl" />
            </div>
         </div>
      </div>
   );
};

export default EventDetailPageSkeleton;
