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
         <div className="p-3 rounded-md bg-muted">
            <Skeleton className="h-7 w-32 mb-4" />
            <ul className="space-y-4 sm:space-y-5">
               {/* Fine Art Type Skeleton */}
               <li className="flex items-center space-x-3 sm:space-x-4">
                  <Skeleton className="h-4 w-4 rounded-full" />{" "}
                  {/* Icon placeholder */}
                  <Skeleton className="h-4 w-56" />
               </li>
               {/* Community Member Skeleton */}
               <li className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Skeleton className="h-4 w-4 rounded-full" />{" "}
                  {/* Icon placeholder */}
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24 rounded-full" />{" "}
                  {/* Badge placeholder */}
               </li>
               {/* Custom Orders Skeleton */}
               <li className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Skeleton className="h-4 w-4 rounded-full" />{" "}
                  {/* Icon placeholder */}
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-6 w-24 rounded-full" />{" "}
                  {/* Badge placeholder */}
               </li>
               {/* Collaborations Skeleton */}
               <li className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Skeleton className="h-4 w-4 rounded-full" />{" "}
                  {/* Icon placeholder */}
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-6 w-24 rounded-full" />{" "}
                  {/* Badge placeholder */}
               </li>
            </ul>
         </div>
      </div>
   );
}
