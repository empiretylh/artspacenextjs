import { Skeleton } from "@/components/ui/skeleton";

export const FilterRowSkeleton = () => {
   // Number of placeholder selects
   const placeholders = 3; // Category, Genre, Style

   return (
      <div className="overflow-x-auto py-2">
         <div className="flex gap-2 min-w-max">
            {Array.from({ length: placeholders }).map((_, i) => (
               <Skeleton key={i} className="h-9 w-32 rounded-xl" />
            ))}
         </div>
      </div>
   );
};
