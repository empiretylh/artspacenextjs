'use client'

import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import Price from "@/components/common/price";
import SecureIcon from "@/components/icons/secure-icon";
import VerifyIcon from "@/components/icons/verify-icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { paths } from "@/config/paths";
import { useAuth } from "@/features/auth/store";
import { cn, getImage, getUserDisplayName, getUserRouteType, timeAgo } from "@/lib/utils";
import type { Artwork } from "@/types";
import { useRouter } from "@/i18n/routing";
import { ecommerceAnalytics, itemFromArtwork } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Loader2, Bookmark, MessageSquare } from "lucide-react";
import { SaveToBoardDialog } from "@/features/boards/components/save-to-board-dialog";
import { useGetArtworkSaveStatus } from "@/features/service/artspace/save-artwork";
import { env } from "@/config/env";

export function ProductInfoCard({ artwork }: { artwork: Artwork }) {
   const router = useRouter();
   const { user } = useAuth();
   const { source } = useSource();
   const t = useTranslations("Artwork.detail");
   const [isPending, startTransition] = useTransition();
   const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

   const { data: saveStatus } = useGetArtworkSaveStatus({
      artworkId: String(artwork.id),
      enabled: !!user,
   });

   const orderHref = paths.artworks.order.getHref(artwork.id);

   // Prefetch the order page when the artwork is available to eliminate navigation latency
   useEffect(() => {
      if (artwork.status === "AVAILABLE") {
         router.prefetch(orderHref);
      }
   }, [artwork.status, orderHref, router]);

   const handleOrder = () => {
      if (!user) {
         router.push(`${paths.auth.login.getHref()}?redirectTo=${encodeURIComponent(orderHref)}`);
         return;
      }

      // Tracking: Begin Checkout
      ecommerceAnalytics.beginCheckout(
         artwork.currency?.code || "MMK",
         Number(artwork.price) || 0,
         [itemFromArtwork(artwork)],
         source
      );

      startTransition(() => {
         router.push(orderHref);
      });
   };

   const handleInquire = () => {
      const targetUser = artwork.artist_profile || artwork.current_owner_display;
      const targetUserId = targetUser?.id;
      const targetUserType =
         targetUser?.user_type === "ARTIST"
            ? "artists"
            : targetUser?.user_type === "GALLERY"
            ? "galleries"
            : "collectors";

      if (targetUserId) {
         const chatHref = paths.chats.getHref({
            userId: targetUserId,
            userType: targetUserType,
            artworkId: artwork.id,
            artworkTitle: artwork.title,
            artworkImage: artwork.image,
            price: artwork.price,
            currency: artwork.currency?.code,
            status: artwork.status,
            initialMessage: `Hello, I'm interested in acquiring "${artwork.title}". Could you please provide further details?`,
         });

         if (!user) {
            router.push(`${paths.auth.login.getHref()}?redirectTo=${encodeURIComponent(chatHref)}`);
         } else {
            router.push(chatHref);
         }
      } else {
         router.push(paths.faq.getHref());
      }
   };

   const isAvailable = artwork.status === "AVAILABLE";
   const isNotForSale = artwork.status === "NOT_FOR_SALE";
   const isSold = artwork.status === "SOLD" || artwork.status === "SOLD_OUT";
   const hasValidPrice = !(artwork.hide_price || !artwork.price || Number(artwork.price) <= 0);

   return (
      <Card className="py-0 border border-border/80 shadow-xs bg-card/90 backdrop-blur-md rounded-2xl overflow-hidden">
         <CardContent className="p-5 space-y-5">
            {/* Status & Price Header */}
            <div className="space-y-3">
               <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                     {isAvailable ? "Investment Value" : "Acquisition Status"}
                  </span>

                  {isAvailable ? (
                     <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 font-medium px-2.5 py-0.5">
                        Available
                     </Badge>
                  ) : isNotForSale ? (
                     <Badge variant="outline" className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-medium px-2.5 py-0.5">
                        {t("notForSale")}
                     </Badge>
                  ) : (
                     <Badge variant="outline" className="bg-muted text-muted-foreground border-border font-medium px-2.5 py-0.5">
                        {t("sold")}
                     </Badge>
                  )}
               </div>

               {/* Price Display */}
               {hasValidPrice ? (
                  <div className="space-y-1">
                     <div className={cn(
                        "text-3xl sm:text-4xl font-display font-semibold tracking-tight",
                        !isAvailable ? "text-foreground/70" : "text-foreground"
                     )}>
                        <Price currency={artwork.currency} price={artwork.price} />
                     </div>
                     {isAvailable && (
                        <p className="text-xs text-muted-foreground">
                           Taxes and shipping calculated at checkout
                        </p>
                     )}
                  </div>
               ) : (
                  <div className="text-2xl font-display font-semibold text-foreground/90">
                     Price on Request
                  </div>
               )}
            </div>

            {/* Action Buttons Stack (Full Width, Never Truncated) */}
            <div className="space-y-2.5">
               {isAvailable && hasValidPrice ? (
                  <Button
                     disabled={isPending}
                     onClick={handleOrder}
                     className="w-full h-11 text-base rounded-xl font-medium font-display bg-primary text-primary-foreground shadow-sm cursor-pointer hover:bg-primary/90 transition-all active:scale-[0.99]"
                  >
                     {isPending ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           {t("collectNow")}
                        </>
                     ) : (
                        t("collectNow")
                     )}
                  </Button>
               ) : isAvailable && !hasValidPrice ? (
                  <Button
                     onClick={handleInquire}
                     className="w-full h-11 text-base rounded-xl font-medium font-display bg-primary text-primary-foreground shadow-sm cursor-pointer hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                  >
                     <MessageSquare className="w-4 h-4" />
                     {t("inquireArtwork")}
                  </Button>
               ) : (
                  <Button
                     variant="outline"
                     onClick={handleInquire}
                     className="w-full h-11 text-sm rounded-xl font-medium font-display border-border hover:bg-muted text-foreground cursor-pointer flex items-center justify-center gap-2 transition-colors"
                  >
                     <MessageSquare className="w-4 h-4 text-primary" />
                     <span>Inquire for Similar Works</span>
                  </Button>
               )}

               {/* Full Width Save to Board Button */}
               <Button
                  variant="outline"
                  onClick={() => {
                     if (!user) {
                        router.push(
                           `${paths.auth.login.getHref()}?redirectTo=${encodeURIComponent(
                              window.location.pathname
                           )}`
                        );
                        return;
                     }
                     setIsSaveModalOpen(true);
                  }}
                  className={cn(
                     "w-full h-10 text-sm rounded-xl font-medium font-display border gap-2 cursor-pointer transition-colors",
                     saveStatus?.saved
                        ? "border-primary/50 bg-primary/10 text-foreground hover:bg-primary/20"
                        : "border-border/80 text-foreground/80 hover:text-foreground hover:bg-muted/50"
                  )}
               >
                  <Bookmark
                     className={cn(
                        "w-4 h-4 shrink-0 transition-transform",
                        saveStatus?.saved
                           ? "fill-primary text-primary"
                           : "text-muted-foreground"
                     )}
                  />
                  <span>
                     {saveStatus?.saved ? t("savedToBoards") : t("saveForLater")}
                  </span>
               </Button>
            </div>

            <SaveToBoardDialog
               isOpen={isSaveModalOpen}
               onClose={() => setIsSaveModalOpen(false)}
               artwork={artwork}
            />

            {/* Provenance / Seller Block */}
            {artwork.current_owner_display && (
               <div className="pt-4 border-t border-border/60 flex items-center justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                     <AppImage
                        src={getImage(
                           artwork.current_owner_display?.profile?.profile_picture ||
                           artwork?.artist_profile?.profile?.profile_picture
                        )}
                        width={40}
                        height={40}
                        alt={`${getUserDisplayName(artwork.current_owner_display)} profile picture`}
                        containerClassName="w-10 h-10 rounded-full overflow-hidden ring-1 ring-border shadow-xs shrink-0"
                        className="object-cover"
                     />
                     <div className="space-y-0.5 min-w-0">
                        <p className="text-[11px] text-muted-foreground/80 uppercase tracking-wider font-medium">
                           Listed by
                        </p>
                        <Link
                           to={paths[getUserRouteType(artwork.current_owner_display.user_type)].detail.getHref(
                              String(artwork.current_owner_display.id)
                           )}
                           className="block truncate font-semibold text-sm hover:underline text-foreground"
                        >
                           {getUserDisplayName(artwork.current_owner_display)}
                        </Link>
                     </div>
                  </div>

                  {env.NEXT_PUBLIC_FEATURE_CHAT_ENABLE && (
                     <Button
                        size="sm"
                        variant="ghost"
                        onClick={handleInquire}
                        className="text-xs font-medium text-primary hover:text-primary hover:bg-primary/10 shrink-0 cursor-pointer h-8 px-2.5 rounded-lg"
                     >
                        <MessageSquare className="w-3.5 h-3.5 mr-1.5" />
                        Chat
                     </Button>
                  )}
               </div>
            )}

            {/* Reassurance & Verification */}
            <div className="space-y-2.5 pt-4 border-t border-border/60">
               <div className="flex items-center space-x-3 text-muted-foreground">
                  <span className="text-primary shrink-0">
                     <VerifyIcon />
                  </span>
                  <p className="text-xs font-medium text-foreground/80">
                     {t("certificateOfAuthenticity")}
                  </p>
               </div>

               <div className="flex items-center space-x-3 text-muted-foreground">
                  <span className="text-primary shrink-0">
                     <SecureIcon />
                  </span>
                  <p className="text-xs font-medium text-foreground/80">
                     {t("securePayment")}
                  </p>
               </div>
            </div>
         </CardContent>
      </Card>
   );
}
