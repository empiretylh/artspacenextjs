import { Skeleton } from "@/components/ui/skeleton";
import { UserIcon } from "lucide-react"; // Assuming you still want to show a generic UserIcon in the skeleton

export function ArtistProfileSkeleton() {
   return (
      <div className="bg-primary/15 p-2 lg:p-4 rounded-lg">
         {/* Header Skeleton */}
         <Skeleton className="h-7 w-48 mb-4" />

         {/* Artist Info Skeleton */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-3">
            {/* Avatar + Name Skeleton */}
            <div className="flex items-center space-x-4">
               <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-muted-foreground" />
               </div>
               <div>
                  <Skeleton className="h-5 w-40 mb-1" />
                  <Skeleton className="h-4 w-32" />
               </div>
            </div>

            {/* Actions Skeletons */}
            <div className="flex space-x-3">
               <Skeleton className="h-10 w-24 rounded-lg" />
               <Skeleton className="h-10 w-32 rounded-lg" />
            </div>
         </div>

         {/* Description Skeleton */}
         <div className="space-y-2 mb-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-[90%]" />
            <Skeleton className="h-5 w-[80%]" />
         </div>

         {/* Summary Skeleton */}
         <div className="space-y-3">
            <Skeleton className="h-4 w-20" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3.5 rounded-xl border border-border/40 bg-muted/20">
                     <Skeleton className="w-10 h-10 rounded-lg shrink-0" />
                     <div className="space-y-1.5 flex-1 min-w-0">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-4 w-28" />
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   );
}
