import FollowButton from "@/components/app/follow-button";
import Image from "@/components/common/image";
import Link from "@/components/common/link";
import Home from "@/components/icons/home-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { getImage, getUserIcon } from "@/lib/utils";
import type { User } from "@/types";
import {
   Hand,
   Medal,
   CheckCircle2,
   Package,
   Sparkles,
   UserIcon,
} from "lucide-react";

export function ArtistProfile({ artist }: { artist: User }) {
   return (
      <div className="bg-primary/15 p-4 rounded-lg">
         {/* Header */}
         <h2 className="font-bold text-lg mb-2">About the artist</h2>

         {/* Artist Info */}
         <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-3">
            {/* Avatar + Name */}
            <div className="flex items-center space-x-4">
               <Image
                  src={getImage(artist?.profile?.profile_picture)}
                  alt="Profile Picture"
                  className="w-12 h-12 rounded-full overflow-hidden border-4 border-background object-cover"
               />

               <div>
                  <Link to={paths.artists.detail.getHref(String(artist.id))}>
                     <p className="flex items-center gap-2 font-semibold hover:underline text-sm">
                        {artist.first_name + " " + artist.last_name}
                        <span>{getUserIcon(artist.user_type)}</span>
                     </p>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                     {artist.email}
                  </p>
               </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-2">
               <FollowButton
                  size={"default"}
                  following={artist.profile.is_following}
                  userId={String(artist.id)}
                  userType={artist.user_type}
                  className="rounded-lg"
               />

               <Button disabled variant="outline" className="rounded-lg">
                  Send Message
               </Button>
            </div>
         </div>

         {/* Description */}
         <p className="text-sm sm:text-base leading-relaxed mb-3 text-foreground">
            {artist.profile.about || "No about yet"}
         </p>

         {/* Summary */}

         <div className="p-3 rounded-md bg-muted">
            <h2 className="font-bold text-lg mb-2">Summary</h2>
            <ul className="space-y-4 sm:space-y-5">
               {/* Fine Art Type */}
               <li className="flex items-center space-x-3 sm:space-x-4">
                  <Hand className="w-4 h-4" />
                  <p className="text-xs text-foreground">
                     Kind of Fine Art{" "}
                     <span className="text-muted-foreground">
                        Digital Impressionism
                     </span>
                  </p>
               </li>

               {/* Community Member */}
               <li className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Medal className="w-4 h-4" />
                  <p className="text-xs text-foreground">Community Member </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                     <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                  </span>
               </li>

               {/* Custom Orders */}
               <li className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Sparkles className="w-4 h-4" />
                  <p className="text-xs text-foreground">Custom Orders </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                     <CheckCircle2 className="w-4 h-4 mr-1" /> Verified
                  </span>
               </li>

               {/* Collaborations */}
               <li className="flex items-center flex-wrap gap-3 sm:gap-4">
                  <Package className="w-4 h-4" />
                  <p className="text-xs text-foreground">
                     Collaboration with Curators{" "}
                  </p>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                     <CheckCircle2 className="w-4 h-4 mr-1" /> Available
                  </span>
               </li>
            </ul>
         </div>
      </div>
   );
}
