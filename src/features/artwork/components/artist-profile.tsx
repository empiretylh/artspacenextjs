import FollowButton from "@/components/app/follow-button";
import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { getImage, getUserIcon } from "@/lib/utils";
import type { User } from "@/types";
import ArtistSummaryBadges from "@/components/app/profile/artist-summary-badges";

export function ArtistProfile({ artist }: { artist: User }) {
   return (
      <Card className="border border-border/80 bg-card/65 dark:bg-card backdrop-blur-md rounded-xl shadow-xs transition-all duration-300 hover:shadow-sm">
         {/* Header */}
         <CardHeader>
            <h2 className="text-xl font-semibold font-display tracking-tight text-foreground/90">
               About the Artist
            </h2>
         </CardHeader>

         {/* Content */}
         <CardContent className="space-y-6">
            {/* Artist Info */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 pb-4 border-b border-border/50">
               {/* Avatar + Name */}
               <div className="flex items-center space-x-4">
                  <AppImage
                     src={getImage(artist?.profile?.profile_picture)}
                     alt={artist.first_name + " " + artist.last_name}
                     width={56}
                     height={56}
                     containerClassName="w-14 h-14 rounded-full overflow-hidden ring-2 ring-primary/10 shadow-xs"
                     className="object-cover"
                  />

                  <div className="space-y-1">
                     <Link to={paths.artists.detail.getHref(String(artist.id))}>
                        <p className="flex items-center gap-1.5 font-bold hover:underline text-base text-foreground transition-colors">
                           {artist.first_name + " " + artist.last_name}
                           <span>{getUserIcon(artist.user_type)}</span>
                        </p>
                     </Link>
                     <p className="text-xs text-muted-foreground/85 font-medium capitalize">
                        {artist.user_type ? artist.user_type.toLowerCase() : "Artist"}
                     </p>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex items-center space-x-2">
                  <FollowButton
                     size={"default"}
                     following={artist.profile.is_following}
                     userId={String(artist.id)}
                     userType={artist.user_type}
                     className="rounded-lg font-medium shadow-xs transition-transform duration-200 active:scale-95"
                  />

                  {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && (
                     <Link to={paths.chats.getHref({
                        userId: artist.id,
                        userType: artist.user_type === 'ARTIST' ? 'artists' : artist.user_type === 'GALLERY' ? 'galleries' : 'collectors'
                     })}>
                        <Button variant="outline" className="rounded-lg font-medium shadow-xs transition-transform duration-200 active:scale-95">
                           Send Message
                        </Button>
                     </Link>
                  )}
               </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
               {artist.profile.about ? (
                  <p className="text-sm leading-relaxed text-foreground/80 pl-4 border-l-2 border-primary/30 py-1">
                     {artist.profile.about}
                  </p>
               ) : (
                  <p className="text-sm leading-relaxed text-muted-foreground/60 italic pl-4 border-l-2 border-border/40 py-1">
                     No introduction available.
                  </p>
               )}
            </div>

            {/* Summary */}
            {artist.profile?.artist_badges && artist.profile.artist_badges.length > 0 && (
               <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">
                     Summary
                  </h3>
                  <ArtistSummaryBadges badges={artist.profile.artist_badges} />
               </div>
            )}
         </CardContent>
      </Card>
   );
}
