'use client'

import { Fragment, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { ArrowRight, ImageOff, Loader2 } from "lucide-react";
import Link from "@/components/common/link";
import ArtworkCard from "@/components/app/artwork-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useGetArtworksByUserIdInfinite } from "@/features/service/artspace/get-artworks-by-user-id";
import { useGetUploadedArtworksInfinite } from "@/features/service/artspace/get-uploaded-artworks";
import type { Artwork } from "@/types";

interface UserArtworksSidebarProps {
   userId?: string;
   viewAllHref?: string;
   isOwnProfile?: boolean;
   title?: string;
}

export const UserArtworksSidebar: React.FC<UserArtworksSidebarProps> = ({
   userId,
   viewAllHref,
   isOwnProfile = false,
   title = "Artworks",
}) => {
   const { ref: loadMoreRef, inView } = useInView({
      threshold: 0,
   });
   const loadingLockRef = useRef(false);
   const lockTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

   // Fetch public artworks by userId or private uploaded artworks for own profile
   const publicArtworksQuery = useGetArtworksByUserIdInfinite({
      userId: userId || "",
      limit: 6,
   });

   const ownArtworksQuery = useGetUploadedArtworksInfinite({
      limit: 6,
   });

   const {
      data,
      isLoading,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
   } = isOwnProfile ? ownArtworksQuery : publicArtworksQuery;

   useEffect(() => {
      if (
         !inView ||
         !hasNextPage ||
         isFetchingNextPage ||
         loadingLockRef.current
      )
         return;

      loadingLockRef.current = true;
      fetchNextPage();

      if (lockTimeoutRef.current) {
         clearTimeout(lockTimeoutRef.current);
      }
      lockTimeoutRef.current = setTimeout(() => {
         loadingLockRef.current = false;
      }, 1000);
   }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

   useEffect(() => {
      return () => {
         if (lockTimeoutRef.current) {
            clearTimeout(lockTimeoutRef.current);
         }
      };
   }, []);

   const totalCount = data?.pages?.[0]?.count ?? 0;
   const allArtworks = data?.pages.flatMap((page) => page.results) ?? [];

   return (
      <aside aria-labelledby="user-artworks-sidebar-title" className="w-full space-y-4">
         {/* Header */}
         <div className="flex items-center justify-between gap-2 border-b border-border/40 pb-3">
            <div className="flex items-center gap-2">
               <h2
                  id="user-artworks-sidebar-title"
                  className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground"
               >
                  {title}
               </h2>
               {!isLoading && totalCount > 0 && (
                  <Badge variant="secondary" className="px-2 py-0.5 text-xs font-semibold rounded-full">
                     {totalCount}
                  </Badge>
               )}
            </div>

            {viewAllHref && totalCount > 0 && (
               <Link
                  to={viewAllHref}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline group"
               >
                  <span>View all</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
               </Link>
            )}
         </div>

         {/* Initial Loading Skeletons */}
         {isLoading && (
            <div className="space-y-6">
               {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                     <Skeleton className="w-full aspect-square rounded-sm" />
                     <Skeleton className="h-4 w-3/4 rounded" />
                     <Skeleton className="h-3 w-1/2 rounded" />
                  </div>
               ))}
            </div>
         )}

         {/* Empty State */}
         {!isLoading && allArtworks.length === 0 && (
            <div className="flex flex-col items-center justify-center p-8 rounded-xl border border-dashed border-border bg-card/30 text-center space-y-3">
               <div className="p-3 bg-muted rounded-full text-muted-foreground">
                  <ImageOff className="w-6 h-6" />
               </div>
               <p className="text-sm font-medium text-foreground">No artworks yet</p>
               <p className="text-xs text-muted-foreground max-w-xs">
                  {isOwnProfile
                     ? "Upload artworks to showcase them on your profile."
                     : "This user hasn't published any artworks yet."}
               </p>
               {isOwnProfile && viewAllHref && (
                  <Link to={viewAllHref}>
                     <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                        Go to Artworks tab
                     </Badge>
                  </Link>
               )}
            </div>
         )}

         {/* 1-Column Artwork List */}
         {!isLoading && allArtworks.length > 0 && (
            <div className="flex flex-col gap-6">
               {allArtworks.map((artwork: Artwork) => (
                  <div key={artwork.id} className="w-full">
                     <ArtworkCard
                        artwork={artwork}
                        className="w-full"
                        publicCard={!isOwnProfile}
                     />
                  </div>
               ))}
            </div>
         )}

         {/* Infinite Scroll Sentinel / Loading More */}
         {hasNextPage && !isLoading && (
            <div ref={loadMoreRef} className="py-4 flex justify-center">
               {isFetchingNextPage ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                     <Loader2 className="w-4 h-4 animate-spin text-primary" />
                     <span>Loading more artworks...</span>
                  </div>
               ) : (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground/40">
                     Scroll for more
                  </span>
               )}
            </div>
         )}

         {!hasNextPage && !isLoading && allArtworks.length > 0 && (
            <div className="py-4 text-center">
               <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40">
                  End of Artworks
               </span>
            </div>
         )}
      </aside>
   );
};

export default UserArtworksSidebar;
