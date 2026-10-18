import { Skeleton } from "@/components/ui/skeleton";

export default function ArtworkImageCarouselSkeleton() {
   return (
      <div className="w-full">
         <Skeleton className="h-[350px] sm:h-[460px] lg:h-[540px] w-full rounded-xl" />
      </div>
   );
}
