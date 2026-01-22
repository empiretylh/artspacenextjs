import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const ProfileCardSkeleton = () => {
   return (
      <div className="flex flex-col items-center border rounded-2xl overflow-hidden bg-background">
         {/* Cover Image Skeleton */}
         <Skeleton className="h-[110px] w-full" />

         {/* Avatar Skeleton */}
         <div className="mt-[-32px] flex flex-col items-center pb-4">
            <Skeleton className="w-12 h-12 rounded-full border-4" />

            {/* Name Skeleton */}
            <Skeleton className="mt-4 h-4 w-3/4 rounded" />

            {/* Username Skeleton */}
            <Skeleton className="mt-2 h-3 w-1/2 rounded" />

            {/* Bio Skeleton */}
            <Skeleton className="mt-1 h-3 w-5/6 rounded" />

            {/* Buttons Skeleton */}
            <div className="flex gap-2 mt-3">
               <Skeleton className="h-8 w-20 rounded" />
               <Skeleton className="h-8 w-20 rounded" />
            </div>
         </div>
      </div>
   );
};

export default ProfileCardSkeleton;
