import { Skeleton } from "@/components/ui/skeleton";
// Using lucide for consistency

export function ProductInfoCardSkeleton() {
   return (
      <div className="p-6 border rounded-lg shadow-sm">
         {/* Header Skeleton */}
         <div className="flex items-center space-x-3 mb-4">
            <Skeleton className="w-12 h-12 rounded-full" />
            <div className="space-y-2">
               <Skeleton className="h-5 w-32" />
               <Skeleton className="h-4 w-24" />
               <Skeleton className="h-4 w-48" />
            </div>
         </div>

         {/* Price Skeleton */}
         <div className="mb-6 space-y-3">
            <Skeleton className="h-9 w-40" />
         </div>

         {/* Buttons Skeleton */}
         <div className="space-y-3 mb-6">
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
            <Skeleton className="h-10 w-full rounded-md" />
         </div>

         {/* Details Skeleton */}
         <div className="space-y-4">
            {/* Detail Item 1 */}
            <div className="flex items-center space-x-3 md:space-x-4">
               <Skeleton className="h-6 w-6" />
               <Skeleton className="h-4 w-48" />
            </div>
            {/* Detail Item 2 */}
            <div className="flex items-center space-x-3 md:space-x-4">
               <Skeleton className="h-6 w-6" />
               <Skeleton className="h-4 w-56" />
            </div>
            {/* Detail Item 3 */}
            <div className="flex items-center space-x-3 md:space-x-4">
               <Skeleton className="h-6 w-6" />
               <Skeleton className="h-4 w-40" />
            </div>
         </div>
      </div>
   );
}
