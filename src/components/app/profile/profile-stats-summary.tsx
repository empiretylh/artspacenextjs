import ArtworksIcon from "@/components/icons/artworks-icon";
import BookmarkIcon from "@/components/icons/bookmark-icon";
import CollectionIcon from "@/components/icons/collection-icon";
import { Users } from "lucide-react";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { cn, getUserRouteType } from "@/lib/utils";
import type { User } from "@/types";

interface ProfileStatsSummaryProps {
   user?: User;
   className?: string;
   isOwnProfile?: boolean;
}

export function ProfileStatsSummary({
   user,
   className,
   isOwnProfile,
}: ProfileStatsSummaryProps) {
   if (!user) return null;

   const artworkCount = user.artwork_count ?? user.num_artworks;
   const collectionCount = user.collection_count;
   const followerCount = user.profile?.follower_count;
   const saveCount = user.save_collection_count;

   const hasCounters =
      artworkCount !== undefined ||
      collectionCount !== undefined ||
      followerCount !== undefined ||
      saveCount !== undefined;

   if (!hasCounters) return null;

   const safeArtworkCount = artworkCount ?? 0;
   const safeCollectionCount = collectionCount ?? 0;
   const safeFollowerCount = followerCount ?? 0;
   const safeSaveCount = saveCount ?? 0;

   const userRouteType = user.user_type ? getUserRouteType(user.user_type) : "artists";

   const artworkHref = isOwnProfile
      ? paths.profile.artworks.path
      : paths[userRouteType]?.artworks?.getHref(String(user.id));

   const collectionHref = isOwnProfile
      ? paths.profile.collections.path
      : paths[userRouteType]?.collections?.getHref(String(user.id));

   const saveHref = isOwnProfile
      ? paths.profile.save.path
      : paths[userRouteType]?.save?.getHref(String(user.id));

   const artworkLabel = "Artworks";

   const followerLabel = safeFollowerCount === 1 ? "Follower" : "Followers";

   const items = [
      {
         label: artworkLabel,
         value: safeArtworkCount,
         icon: <ArtworksIcon />,
         href: artworkHref,
      },
      {
         label: "Collections",
         value: safeCollectionCount,
         icon: <CollectionIcon />,
         href: collectionHref,
      },
      {
         label: followerLabel,
         value: safeFollowerCount,
         icon: <Users className="w-4 h-4" />,
         href: undefined,
      },
      {
         label: "Boards",
         value: safeSaveCount,
         icon: <BookmarkIcon />,
         href: saveHref,
      },
   ];

   return (
      <div
         className={cn("grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm", className)}
         role="list"
         aria-label="Profile counters summary"
      >
         {items.map((item, idx) => {
            const content = (
               <div
                  className={cn(
                     "flex flex-col p-3 sm:p-4 rounded-xl border border-border/50 bg-card/40 transition-all h-full",
                     item.href
                        ? "hover:bg-muted/40 hover:border-border cursor-pointer group"
                        : "opacity-90"
                  )}
                  role="listitem"
               >
                  <div className="flex items-center justify-between mb-2">
                     <span
                        className={cn(
                           "text-xs text-muted-foreground font-medium truncate",
                           item.href && "group-hover:text-foreground transition-colors"
                        )}
                        title={item.label}
                     >
                        {item.label}
                     </span>
                     <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        {item.icon}
                     </div>
                  </div>
                  <span
                     className={cn(
                        "text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground",
                        item.href && "group-hover:text-primary transition-colors"
                     )}
                  >
                     {item.value}
                  </span>
               </div>
            );

            if (item.href) {
               return (
                  <Link key={idx} to={item.href} className="block">
                     {content}
                  </Link>
               );
            }

            return <div key={idx}>{content}</div>;
         })}
      </div>
   );
}

export default ProfileStatsSummary;
