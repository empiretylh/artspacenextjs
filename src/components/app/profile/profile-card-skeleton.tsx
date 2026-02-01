import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileCardSkeleton() {
   return (
      <div className="flex w-full justify-center border rounded-2xl overflow-hidden bg-background">
         <div className="w-full flex flex-col items-center">
            {/* Cover */}
            <div className="hidden md:block relative w-full h-[110px]">
               <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-background" />
            </div>

            <div className="mt-3 md:mt-[-32px] flex flex-col items-center pb-4 w-full">
               {/* Avatar */}
               <div className="relative mb-2 w-16 h-16">
                  <Skeleton className="w-full h-full rounded-full border-2 border-background" />
               </div>

               {/* User Info */}
               <div className="text-center px-2 mb-1 md:mb-3 w-full flex flex-col items-center">
                  {/* Name */}
                  <div className="mb-2 min-h-[24px] flex items-center justify-center">
                     <Skeleton className="h-4 sm:h-5 w-[120px]" />
                  </div>

                  {/* Username */}
                  <Skeleton className="h-4 w-[100px] mb-1" />

                  {/* Bio */}
                  <Skeleton className="hidden sm:block h-4 w-[150px]" />
               </div>

               {/* Actions */}
               <div className="flex gap-1 px-2 w-full justify-center flex-wrap min-h-[36px]">
                  <Skeleton className="h-8 w-full md:w-[90px] rounded-md" />
                  <Skeleton className="hidden sm:block h-8 w-[90px] rounded-md" />
               </div>
            </div>
         </div>
      </div>
   );
}
