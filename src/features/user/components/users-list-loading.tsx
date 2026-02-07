import ProfileCardSkeleton from "@/components/app/profile/profile-card-skeleton";

export default function UsersListLoading({ withTitle = false }: { withTitle?: boolean }) {
   return (
      <div className="mb-4">
         {/* Title placeholder */}
         {withTitle && (
            <div className="flex items-center justify-between mb-4">
               <div className="h-6 w-32 bg-muted rounded-md animate-pulse" />
            </div>
         )}

         {/* Filter badges placeholder */}
         {/* <div className="flex flex-wrap gap-2 mb-4">
            {Array.from({ length: 3 }).map((_, i) => (
               <div
                  key={i}
                  className="h-6 w-20 rounded-full bg-muted animate-pulse"
               />
            ))}
         </div> */}

         {/* Users grid */}
         <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 2xl:grid-cols-6 gap-2">
            {Array.from({ length: 18 }).map((_, i) => (
               <ProfileCardSkeleton key={i} />
            ))}
         </div>
      </div>
   );
}
