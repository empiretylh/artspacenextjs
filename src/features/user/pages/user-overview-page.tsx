'use client'
import ArtistSummaryBadges from "@/components/app/profile/artist-summary-badges";
import { useProfileUser } from "@/components/providers/profile-user-provider";
import { getImage, getUserRouteType } from "@/lib/utils";
import { paths } from "@/config/paths";
import { UserArtworksSidebar } from "@/features/user/components/user-artworks-sidebar";

const UserOverviewPage = () => {
   const { data: user } = useProfileUser();

   const userRouteType = user?.user_type ? getUserRouteType(user.user_type) : "artists";
   const artworksHref = user?.id && paths[userRouteType]?.artworks
      ? paths[userRouteType].artworks.getHref(String(user.id))
      : undefined;

   return (
      <section className="w-full" aria-labelledby="user-overview-title">
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 2/3 Left Column: Overview Details */}
            <div className="space-y-8 lg:col-span-2">
               <div>
                  <h2
                     id="user-overview-title"
                     className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground mb-4"
                  >
                     About the user
                  </h2>
                  <p className="text-base text-foreground/90 leading-relaxed">
                     {user?.profile?.about || "No about yet"}
                  </p>
               </div>
               {user?.profile?.artist_badges && user.profile.artist_badges.length > 0 && (
                  <div>
                     <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground mb-4">
                        Summary
                     </h2>
                     <ArtistSummaryBadges badges={user.profile.artist_badges} />
                  </div>
               )}
               {user?.profile?.features_photos && user.profile.features_photos.length > 0 && (
                  <div>
                     <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground mb-4">
                        Featured Highlights
                     </h2>
                     <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {user.profile.features_photos.map((image) => (
                           <figure key={image.id} className="relative group overflow-hidden rounded-xl border border-border/40 bg-muted/10">
                              <img
                                 src={getImage(image.image)}
                                 className="w-full aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                                 alt={image.description || "Featured photo"}
                              />
                           </figure>
                        ))}
                     </div>
                  </div>
               )}
            </div>

            {/* 1/3 Right Column: 1-Column Infinite Scroll Artworks List */}
            <div className="lg:col-span-1">
               <UserArtworksSidebar
                  userId={user?.id ? String(user.id) : undefined}
                  viewAllHref={artworksHref}
                  isOwnProfile={false}
               />
            </div>
         </div>
      </section>
   );
};

export default UserOverviewPage;
