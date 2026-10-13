import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { env } from "@/config/env";
import { useAuth } from "@/features/auth/store";
import { getImage, getUserIcon, getUserLink } from "@/lib/utils";
import type { User } from "@/types";
import FollowButton from "../follow-button";
import { paths } from "@/config/paths";

export default function ProfileCard({ user }: { user: User }) {
   const { user: authUser } = useAuth();

   const coverSrc =
      user.profile?.cover_photo
         ? getImage(user.profile.cover_photo)
         : "/assets/profile-cover-default.jpg";

   const avatarSrc =
      user.profile?.profile_picture
         ? getImage(user.profile.profile_picture)
         : "/assets/profile-default.png";

   const fullName = `${user.first_name || ""} ${user.last_name || ""}`.trim() || "User";

   return (
      <div className="flex w-full justify-center border border-border/80 rounded-xl overflow-hidden bg-background shadow-xs hover:shadow-sm transition-all duration-300">
         <div className="w-full flex flex-col items-center">
            {/* Cover */}
            <div className="hidden md:block relative aspect-2/1 overflow-hidden w-full">
               <AppImage
                  src={coverSrc}
                  alt={`${fullName} cover`}
                  width={800}
                  height={300}
                  // On desktop, cards are usually in a grid. 
                  // Adjust 350px to match your actual card's max-width.
                  sizes="(max-width: 768px) 100vw, 350px"
                  className="object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-b from-transparent from-60% to-background" />
            </div>

            <div className="mt-3 md:mt-[-32px] flex flex-col items-center pb-4 w-full px-2">
               {/* Avatar */}
               <div className="relative mb-2 w-16 h-16 shrink-0">
                  <AppImage
                     src={avatarSrc}
                     alt={fullName}
                     width={64} // 16 * 4 = 64px
                     height={64}
                     className="rounded-full border-2 border-background object-cover bg-muted"
                  />
               </div>

               {/* Info */}
               <div className="text-center mb-3 w-full min-w-0">
                  <div className="flex items-center justify-center gap-1 sm:gap-1.5 mb-1 w-full min-w-0 px-1">
                     <Link
                        to={getUserLink(user, authUser!)}
                        className="min-w-0 truncate block"
                     >
                        <h2
                           className="text-xs sm:text-sm md:text-base font-semibold hover:underline truncate font-display tracking-tight text-foreground"
                           title={fullName}
                        >
                           {fullName}
                        </h2>
                     </Link>
                     <span className="shrink-0 inline-flex items-center">
                        {getUserIcon(user.user_type)}
                     </span>
                  </div>

                  <div className="h-14 sm:h-16 flex items-center justify-center w-full">
                     {(() => {
                        const bio = user.profile?.bio?.trim();
                        const hasEnoughBio = Boolean(bio && bio.length >= 15);

                        if (hasEnoughBio) {
                           return (
                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed px-1 mx-auto max-w-[200px]" title={bio}>
                                 {bio}
                              </p>
                           );
                        }

                        const artworkCount = user.artwork_count ?? user.num_artworks;
                        const collectionCount = user.collection_count;
                        const likeCount = user.like_artwork_count;
                        const saveCount = user.save_collection_count;

                        const hasCounters =
                           artworkCount !== undefined ||
                           collectionCount !== undefined ||
                           likeCount !== undefined ||
                           saveCount !== undefined;

                        if (hasCounters) {
                           const safeArtworkCount = artworkCount ?? 0;
                           const safeCollectionCount = collectionCount ?? 0;
                           const safeLikeCount = likeCount ?? 0;
                           const artworkLabel =
                              user.user_type === "COLLECTOR"
                                 ? "Collected"
                                 : safeArtworkCount === 1
                                    ? "Artwork"
                                    : "Artworks";
                           const collectionLabel =
                              safeCollectionCount === 1 ? "Collection" : "Collections";
                           const likeLabel = safeLikeCount === 1 ? "Like" : "Likes";

                           const secondaryValue =
                              safeCollectionCount > 0 || safeLikeCount === 0
                                 ? safeCollectionCount
                                 : safeLikeCount;
                           const secondaryLabel =
                              safeCollectionCount > 0 || safeLikeCount === 0
                                 ? collectionLabel
                                 : likeLabel;

                           return (
                              <div className="flex items-center justify-center w-full px-1 text-center select-none">
                                 {/* Mobile view (< sm): two metrics stacked vertically */}
                                 <div className="sm:hidden flex flex-col items-center justify-center gap-1.5 text-xs">
                                    <div className="flex items-center justify-center gap-1">
                                       <span className="font-semibold text-foreground">
                                          {safeArtworkCount}
                                       </span>
                                       <span className="text-muted-foreground">
                                          {artworkLabel}
                                       </span>
                                    </div>
                                    <div className="flex items-center justify-center gap-1 text-muted-foreground text-[11px]">
                                       <span className="font-semibold text-foreground">
                                          {secondaryValue}
                                       </span>
                                       <span>
                                          {secondaryLabel}
                                       </span>
                                    </div>
                                 </div>

                                 {/* Desktop view (>= sm): two key metrics side-by-side */}
                                 <div className="hidden sm:flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                                    <span className="font-semibold text-foreground">
                                       {safeArtworkCount}
                                    </span>
                                    <span>{artworkLabel}</span>
                                    <span className="text-muted-foreground/40">•</span>
                                    <span className="font-semibold text-foreground">
                                       {secondaryValue}
                                    </span>
                                    <span>{secondaryLabel}</span>
                                 </div>
                              </div>
                           );
                        }

                        return (
                           <span className="capitalize text-muted-foreground/75 text-xs">
                              {user.user_type ? user.user_type.toLowerCase() : "Artist"}
                           </span>
                        );
                     })()}
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-1.5 w-full justify-center items-center flex-wrap">
                  <FollowButton
                     size={"sm"}
                     userId={String(user.id)}
                     userType={user.user_type}
                     following={user.profile?.is_following}
                     className="w-full sm:w-auto rounded-lg text-xs"
                  />
                  {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && (
                     <Link
                        to={paths.chats.getHref({
                           userId: user.id,
                           userType: user.user_type === 'ARTIST' ? 'artists' : user.user_type === 'GALLERY' ? 'galleries' : 'collectors'
                        })}
                        className="hidden sm:inline-block"
                     >
                        <Button
                           size="sm"
                           variant="outline"
                           className="text-xs px-2.5 py-1.5 h-8 rounded-lg"
                        >
                           Message
                        </Button>
                     </Link>
                  )}
               </div>
            </div>
         </div>
      </div>
   );
}
