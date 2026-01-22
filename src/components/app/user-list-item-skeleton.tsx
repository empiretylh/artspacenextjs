import { Skeleton } from "@/components/ui/skeleton";

const UserListItemSkeleton = () => {
   return (
      <div className="flex py-2 gap-2 w-full justify-between items-center">
         <div className="flex items-center gap-2 min-w-0">
            {/* Avatar */}
            <Skeleton className="w-10 h-10 rounded-full" />

            {/* Name + email block */}
            <div className="flex flex-col gap-1 min-w-0 max-w-[140px]">
               <Skeleton className="h-4 w-20" />
               <Skeleton className="h-3 w-28" />
            </div>
         </div>

         {/* Follow button */}
         <Skeleton className="h-8 w-12 rounded-md" />
      </div>
   );
};

export default UserListItemSkeleton;
