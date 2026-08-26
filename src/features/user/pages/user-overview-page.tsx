'use client'
// import UsersIcon from "@/components/icons/users-icon";
import AwardIcon from "@/components/icons/award-icon";
import CheckMarkIcon from "@/components/icons/check-mark-icon";
import Layers2Icon from "@/components/icons/layers-2-icon";
import SquareStackIcon from "@/components/icons/square-stack-icon";
import { useProfileUser } from "@/components/providers/profile-user-provider";
import { getImage } from "@/lib/utils";

const UserOverviewPage = () => {
   const { data: user } = useProfileUser();

   return (
      <section className="" aria-labelledby="user-overview-title">
         <div className="space-y-8 col-span-3 md:col-span-2">
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
            <div>
               <h2 className="text-xl sm:text-2xl font-semibold font-display tracking-tight text-foreground mb-4">
                  Summary
               </h2>
               <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm" role="list">
                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40" role="listitem">
                     <div className="text-primary p-2 bg-primary/10 rounded-lg shrink-0">
                        <AwardIcon />
                     </div>
                     <div className="min-w-0">
                        <p className="text-xs text-muted-foreground">Medium / Style</p>
                        <p className="font-medium text-foreground truncate">Digital Impressionism</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40" role="listitem">
                     <div className="text-primary p-2 bg-primary/10 rounded-lg shrink-0">
                        <AwardIcon />
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Identity</p>
                        <div className="flex items-center text-xs font-medium text-success gap-1 mt-0.5">
                           <CheckMarkIcon size={16} className="w-3.5 h-3.5" /> Verified Profile
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40" role="listitem">
                     <div className="text-primary p-2 bg-primary/10 rounded-lg shrink-0">
                        <Layers2Icon />
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Collection</p>
                        <div className="flex items-center text-xs font-medium text-success gap-1 mt-0.5">
                           <CheckMarkIcon size={16} className="w-3.5 h-3.5" /> Verified Collection
                        </div>
                     </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/40" role="listitem">
                     <div className="text-primary p-2 bg-primary/10 rounded-lg shrink-0">
                        <SquareStackIcon />
                     </div>
                     <div className="min-w-0 flex-1">
                        <p className="text-xs text-muted-foreground">Exhibition</p>
                        <div className="flex items-center text-xs font-medium text-success gap-1 mt-0.5">
                           <CheckMarkIcon size={16} className="w-3.5 h-3.5" /> Authenticated
                        </div>
                     </div>
                  </div>
               </div>
            </div>
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
         {/* <div className="col-span-3 md:col-span-1">
            <UserArtworksList />
         </div> */}
      </section>
   );
};

export default UserOverviewPage;
