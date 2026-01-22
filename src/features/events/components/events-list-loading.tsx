import LoadingPage from "@/components/page/loading-page";
import { Skeleton } from "@/components/ui/skeleton";

const EventsListLoading = () => {
   return (
      <>
         {/* <div className="flex gap-2 justify-end items-center">
            <Skeleton className="h-9 w-[180px] rounded-xl" />
            <Skeleton className="h-9 w-32 rounded-xl" />
         </div> */}
         <div className="mb-4">
            {/* <div className="grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-2 auto-rows-[1px] h-full">
                     {Array.from({ length: gridItems }).map((_, i) => (
                        <MasonrySkeletonItem key={i} />
                     ))}
                  </div> */}
            <LoadingPage />

            {/* Load More Button Skeleton */}
            <div className="flex justify-center my-2">
               <Skeleton className="h-10 w-40 rounded-lg" />
            </div>
         </div>
      </>
   );
};

export default EventsListLoading;
