import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileCardSkeleton() {
   return (
      <div className="flex w-full justify-center border border-border/80 rounded-xl overflow-hidden bg-background">
         <div className="w-full flex flex-col items-center">
            {/* Cover */}
            <div className="hidden md:block relative aspect-8/3 w-full">
               <Skeleton className="absolute inset-0 w-full h-full rounded-none" />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent from-30% to-background" />
            </div>

            <div className="mt-3 md:mt-[-32px] flex flex-col items-center pb-4 w-full px-2">
               {/* Avatar */}
               <div className="relative mb-2 w-16 h-16">
                  <Skeleton className="w-full h-full rounded-full border-2 border-background" />
               </div>

               {/* User Info */}
               <div className="text-center mb-3 w-full flex flex-col items-center">
                  {/* Name */}
                  <div className="mb-1 min-h-[22px] w-full flex items-center justify-center">
                     <Skeleton className="h-4 sm:h-5 w-[110px]" />
                  </div>

                  {/* Bio / Subtitle */}
                  <div className="h-14 sm:h-16 flex flex-col justify-center items-center gap-1.5 w-full">
                     <Skeleton className="h-3 w-[120px]" />
                     <Skeleton className="h-3 w-[80px]" />
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-1.5 w-full justify-center items-center flex-wrap">
                  <Skeleton className="h-8 w-full sm:w-[65px] rounded-lg" />
                  <Skeleton className="hidden sm:block h-8 w-[65px] rounded-lg" />
               </div>
            </div>
         </div>
      </div>
   );
}
