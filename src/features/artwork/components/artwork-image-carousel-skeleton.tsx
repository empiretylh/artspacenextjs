import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkImageCarouselSkeleton() {
   return (
      <div className="w-full space-y-2">
         {/* Main Image Skeleton */}
         <Skeleton className="h-100 w-full rounded-xl" />
      </div>
   );
}
