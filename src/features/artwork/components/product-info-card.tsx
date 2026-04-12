import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import Price from "@/components/common/price";
import DeliverIcon from "@/components/icons/deliver-icon";
import SecureIcon from "@/components/icons/secure-icon";
import VerifyIcon from "@/components/icons/verify-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import { getImage, getUserRouteType, timeAgo } from "@/lib/utils";
import type { Artwork } from "@/types";
import { useRouter } from "next/navigation";

export function ProductInfoCard({ artwork }: { artwork: Artwork }) {
   const router = useRouter();
   const { user } = useAuth();

   const handleOrder = () => {
      if (!user) {
         router.push(paths.auth.login.getHref())
         return;
      }
      router.push(paths.artworks.order.getHref(artwork.id));
   };

   return (
      <Card>
         <CardContent>
            {/* Header */}
            <div className="flex items-center space-x-3 mb-2">
               <AppImage
                  src={getImage(
                     artwork?.artist_profile?.profile?.profile_picture
                  )}
                  width={48}
                  height={48}
                  alt={`${artwork.current_owner_display?.first_name || ''} ${artwork.current_owner_display?.last_name || ''} profile picture`}
                  containerClassName="w-12 h-12 rounded-full overflow-hidden"
                  className="object-cover"
               />

               <div className="space-y-1">
                  {
                     artwork.current_owner_display && (
                        <Link
                           to={paths[getUserRouteType(artwork.current_owner_display.user_type)].detail.getHref(
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
                     )
                  }
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
               <p className="text-2xl md:text-3xl font-display text-foreground">
                  {!artwork.hide_price && <Price currency={artwork.currency} price={artwork.price} />}
               </p>
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
                  disabled={artwork.status !== "AVAILABLE"}
                  onClick={handleOrder}
                  className="w-full text-base rounded-md font-medium font-display bg-primary text-primary-foreground"
               >
                  {artwork.status === "AVAILABLE" ? "Order Now" :
                     artwork.status === "SOLD" ? "Sold" :
                        artwork.status === "SOLD_OUT" ? "Sold Out" :
                           artwork.status === "NOT_FOR_SALE" ? "Not For Sale" : "Order Now"}
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
