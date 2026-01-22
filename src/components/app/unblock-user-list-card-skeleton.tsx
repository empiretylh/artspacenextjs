import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type UnblockUserListCardSkeletonProps = {
   border?: boolean;
   className?: string;
};

const UnblockUserListCardSkeleton = ({
   border = false,
   className,
}: UnblockUserListCardSkeletonProps) => {
   return (
      <div
         className={cn(
            "flex py-2 gap-2 w-full justify-between items-center",
            border && "border px-2 rounded-lg",
            className
         )}
      >
         {/* Left section: avatar + text */}
         <div className="flex items-center gap-2 min-w-0">
            <Skeleton className="w-10 h-10 rounded-full shrink-0" />

            <div className="flex flex-col gap-1 min-w-0">
               <Skeleton className="h-4 w-32" />
               <Skeleton className="h-3 w-40" />
            </div>
         </div>

         {/* Right section: button */}
         <Skeleton className="h-8 w-20 rounded-md" />
      </div>
   );
};

export default UnblockUserListCardSkeleton;
