import { Skeleton } from "@/components/ui/skeleton";

const ArtworkCardSkeleton = () => {
   return (
      <div className="relative overflow-hidden group w-full border rounded-md animate-pulse">
         {/* Image */}
         <Skeleton className="w-full h-60 rounded-md" />

         {/* Artwork Info */}
         <div className="p-2 space-y-2">
            {/* Title */}
            <Skeleton className="w-3/4 h-4 rounded" />
            {/* Dimensions */}
            <Skeleton className="w-1/2 h-3 rounded" />
            {/* Category */}
            <Skeleton className="w-1/3 h-3 rounded" />
            {/* Price / Button */}
            <Skeleton className="w-1/4 h-4 rounded mt-2" />
         </div>
      </div>
   );
};

export default ArtworkCardSkeleton;
