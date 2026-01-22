import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkImageCarouselSkeleton() {
   return (
      <div className="w-full space-y-2">
         {/* Main Image Skeleton */}
         <Skeleton className="h-[450px] w-full rounded-xl" />
         {/* Thumbnails Skeleton */}
         <div className="flex gap-2">
            <Skeleton className="h-24 w-1/4" />
            <Skeleton className="h-24 w-1/4" />
            <Skeleton className="h-24 w-1/4" />
            <Skeleton className="h-24 w-1/4" />
         </div>
      </div>
   );
}
