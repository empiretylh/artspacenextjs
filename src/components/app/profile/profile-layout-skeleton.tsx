import { Skeleton } from "@/components/ui/skeleton";

const ProfileLayoutSkeleton = () => {
   return (
      <div>
         {/* Banner */}
         <Skeleton className="relative w-full aspect-[21/8] rounded-lg mb-2">
            {/* Profile Card */}
            <div className="absolute left-1/2 bottom-0 translate-x-[-50%] translate-y-[70%] text-center w-full px-4">
               {/* Avatar */}
               <Skeleton className="mx-auto aspect-square w-[120px] sm:w-[150px] rounded-full border-4 border-white" />

               {/* Name + Badge */}
               <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-center gap-2">
                     <Skeleton className="h-6 sm:h-7 w-40" />
                     <Skeleton className="h-5 w-5 rounded-full" />
                  </div>

                  {/* Email */}
                  <Skeleton className="h-4 w-48 mx-auto" />

                  {/* Bio */}
                  <Skeleton className="h-4 w-64 mx-auto mt-1" />
                  <Skeleton className="h-4 w-52 mx-auto" />

                  {/* Action Buttons */}
                  <div className="mt-3 flex justify-center gap-2">
                     <Skeleton className="h-10 w-10 rounded-md" />
                     <Skeleton className="h-10 w-24 rounded-md" />
                     <Skeleton className="h-10 w-32 rounded-md" />
                  </div>
               </div>
            </div>
         </Skeleton>

         {/* Navigation */}
         <div className="container pt-[180px] sm:pt-[200px]">
            <div className="flex justify-center">
               <div className="inline-flex gap-4 border-b whitespace-nowrap">
                  {Array.from({ length: 4 }).map((_, i) => (
                     <div
                        key={i}
                        className="flex flex-col items-center gap-2 py-2 px-2"
                     >
                        <Skeleton className="h-6 w-6 rounded" />
                        <Skeleton className="h-6 w-16" />
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   );
};

export default ProfileLayoutSkeleton;
