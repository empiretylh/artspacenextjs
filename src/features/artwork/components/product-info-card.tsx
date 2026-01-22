import Image from "@/components/common/image";
import Link from "@/components/common/link";
import DeliverIcon from "@/components/icons/deliver-icon";
import Home from "@/components/icons/home-icon";
import SecureIcon from "@/components/icons/secure-icon";
import VerifyIcon from "@/components/icons/verify-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { getImage, timeAgo } from "@/lib/utils";
import type { Artwork } from "@/types";
import { User, ShieldCheck, Truck, UserIcon } from "lucide-react";

export function ProductInfoCard({ artwork }: { artwork: Artwork }) {
   return (
      <Card>
         <CardContent>
            {/* Header */}
            <div className="flex items-center space-x-3 mb-2">
               <Image
                  src={getImage(
                     artwork?.artist_profile?.profile?.profile_picture
                  )}
                  alt="Profile Picture"
                  className="w-14 h-14 rounded-full overflow-hidden border-4 border-background object-cover"
               />

               <div className="space-y-1">
                  <Link
                     to={paths.artists.detail.getHref(
                        String(artwork.current_owner_display.id)
                     )}
                  >
                     <p className="flex items-center hover:underline gap-2 text-muted-foreground font-semibold text-sm">
                        {artwork.current_owner_display.first_name}{" "}
                        {artwork.current_owner_display.last_name}
                        {/* <span>
                        <Home className="w-4 h-4" />
                     </span> */}
                     </p>
                  </Link>
                  <p className="text-muted-foreground text-xs">
                     {timeAgo(artwork.created_at)}
                  </p>
                  <p className="text-muted-foreground text-xs">
                     {artwork.category_name}, {artwork.dimensions},{" "}
                     {artwork.year}
                  </p>
               </div>
            </div>

            {/* Price */}
            <div className="mb-6 space-y-2">
               <h1 className="text-2xl md:text-3xl font-display text-foreground">
                  {!artwork.hide_price && `$${artwork.price}`}
               </h1>
               {artwork.hide_price && (
                  <Button
                     disabled
                     className="w-full text-base rounded-md font-medium font-display bg-primary/15 text-primary hover:bg-primary/30"
                  >
                     Request for price
                  </Button>
               )}
            </div>

            {/* Buttons */}
            <div className="space-y-3 mb-6">
               <Button
                  disabled
                  className="w-full text-base rounded-md font-medium font-display bg-primary text-primary-foreground"
               >
                  Add to Cart
               </Button>

               <Button
                  disabled
                  variant="outline"
                  className="w-full text-base rounded-md font-medium font-display border-2 border-border text-foreground/80"
               >
                  Save for Later
               </Button>

               <Button
                  disabled
                  variant="outline"
                  className="w-full text-base rounded-md font-medium font-display border-2 border-border text-foreground/80"
               >
                  Need Help?
               </Button>
            </div>

            {/* Details */}
            <div className="space-y-4">
               <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="text-primary">
                     <VerifyIcon />
                  </span>
                  <p className="text-xs">
                     {artwork.category_name}, {artwork.dimensions},{" "}
                     {artwork.year}
                  </p>
               </div>

               <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="text-primary">
                     <SecureIcon />
                  </span>
                  <p className="text-xs">Secure payment methods: card, bank</p>
               </div>

               <div className="flex items-center space-x-3 md:space-x-4">
                  <span className="text-primary">
                     <DeliverIcon />
                  </span>
                  <p className="text-xs">Free and easy 14 days returns</p>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
