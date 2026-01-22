import { Skeleton } from "@/components/ui/skeleton";

export function ArtworkCharacteristicsCardSkeleton() {
   return (
      <div>
         {/* Title Skeleton */}
         <Skeleton className="h-7 w-3/4 mb-4" />

         <div className="space-y-2 text-sm">
            {/* Year of Creation Skeleton */}
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Year of Creation</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/4" />
               </dd>
            </div>

            {/* Dimensions Skeleton */}
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Dimensions</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/2" />
               </dd>
            </div>

            {/* Medium Skeleton */}
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Medium</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/3" />
               </dd>
            </div>

            {/* Category Skeleton */}
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Category</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/2" />
               </dd>
            </div>

            {/* Type of Art Skeleton */}
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Type of Art</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/3" />
               </dd>
            </div>

            {/* Style Skeleton */}
            <div className="flex border-b border-border gap-2 py-2">
               <dt className="w-1/2">Style</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/2" />
               </dd>
            </div>

            {/* Genre Skeleton */}
            <div className="flex gap-2 py-2">
               <dt className="w-1/2">Genre</dt>
               <dd className="w-1/2">
                  <Skeleton className="h-5 w-1/3" />
               </dd>
            </div>
         </div>
      </div>
   );
}
