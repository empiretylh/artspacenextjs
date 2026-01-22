import { Skeleton } from "@/components/ui/skeleton";

export const GenresListSkeleton = () => {
   return (
      <div className="grid grid-cols-2 sm:grid-cols-4 shrink-0 justify-center items-center gap-4 md:gap-6">
         {Array.from({ length: 4 }).map((_, index) => (
            <div
               key={index}
               className="relative w-full h-[142px] max-w-2xl overflow-hidden rounded-2xl"
            >
               {/* Image placeholder */}
               <Skeleton className="h-full w-full rounded-2xl" />

               {/* Overlay placeholder */}
               <div className="absolute left-2 bottom-2 right-2 p-2 rounded-xl bg-white/20 backdrop-blur-sm">
                  <Skeleton className="h-4 w-24 rounded-md" />
               </div>
            </div>
         ))}
      </div>
   );
};
