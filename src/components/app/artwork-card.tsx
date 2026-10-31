'use client';

import { useTranslations } from "next-intl";
import { paths } from "@/config/paths";
import { cn, getImage, snakeToNormal } from "@/lib/utils";
import React from "react";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Artwork } from "@/types";
import Link from "../common/link";
import { useLike } from "@/hooks/app/use-like";
import AppImage from "../common/app-image";
import { ecommerceAnalytics, itemFromArtwork } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import Price from "../common/price";

interface ArtworkCardProps {
   artwork: Artwork;
   className?: string;
   variant?: "default" | "masonry";
   style?: React.CSSProperties;
   publicCard?: boolean;
   pure?: boolean;
   showLikeButton?: boolean;
   showStatus?: boolean;
}

const getStatusConfig = (
   status?: string,
   translate?: (key: string, fallback: string) => string
) => {
   if (!status) return null;
   const normalized = status.toUpperCase();

   const getLabel = (key: string, fallback: string) => {
      if (translate) return translate(key, fallback);
      return fallback;
   };

   switch (normalized) {
      case "AVAILABLE":
         return {
            label: getLabel("available", "Available"),
            badgeClass: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
         };
      case "NOT_FOR_SALE":
         return {
            label: getLabel("notForSale", "Not for Collect"),
            badgeClass: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
         };
      case "SOLD_OUT":
         return {
            label: getLabel("soldOut", "Collected"),
            badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
         };
      case "SOLD":
         return {
            label: getLabel("sold", "Collected"),
            badgeClass: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
         };
      default:
         return null;
   }
};

const ArtworkCard: React.FC<ArtworkCardProps> = ({
   artwork,
   className,
   variant = "default",
   style,
   publicCard = true,
   pure = false,
   showLikeButton = true,
   showStatus = true,
}) => {
   const t = useTranslations("Artwork.catalog");
   const tFilters = useTranslations("Artwork.filters");

   const translateStatus = React.useCallback((key: string, fallback: string): string => {
      try {
         const res = t(key);
         if (res && typeof res === "string" && !res.startsWith("Artwork.") && !res.includes(".") && res !== key) {
            return res;
         }
      } catch {}
      try {
         const res = tFilters(key);
         if (res && typeof res === "string" && !res.startsWith("Artwork.") && !res.includes(".") && res !== key) {
            return res;
         }
      } catch {}
      return fallback;
   }, [t, tFilters]);

   const shouldShowLike = showLikeButton && publicCard && !pure;
   const shouldShowStatus = showStatus && !pure && !!artwork.status;
   const statusConfig = shouldShowStatus ? getStatusConfig(artwork.status, translateStatus) : null;
   const categoryName = artwork.category_name || artwork.category?.name;
   const { isLiked, handleLike } = useLike({
      artworkId: String(artwork.id),
      initialLiked: artwork.is_liked,
   });
   const { source } = useSource();

   const masonrySizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 300px";
   const defaultSizes = "(max-width: 768px) 100vw, 400px"; // Adjust based on your fixed-height row layout

   const handleOnClick = () => {
      const item = itemFromArtwork(artwork);
      ecommerceAnalytics.select_item(source, snakeToNormal(source), [item], source);
   };

   return (
      <div style={style} className={cn("group relative w-full overflow-hidden transition-all duration-500", className)}>
         {/* Image + Hover Buttons */}
         <div className="relative aspect-square overflow-hidden rounded-sm cursor-pointer">
            {/* Mobile top shadow overlay */}
            <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-black/50 to-transparent z-10 md:hidden pointer-events-none" />
            
            <div className="absolute inset-0 z-10 bg-black/0 transition-colors duration-300 md:group-hover:bg-black/30 pointer-events-none" />

            <Link to={paths.artworks.detail.getHref(artwork.id)} onClick={handleOnClick} className="block w-full h-full">
               <AppImage
                  src={getImage(artwork.image)}
                  alt={artwork.title}
                  title={artwork.title}
                  containerStyle={variant === "masonry" ? {
                     aspectRatio: `auto ${artwork.original_width} / ${artwork.original_height}`,
                  } : {
                     aspectRatio: '1/1'
                  }}
                  width={variant === "masonry" ? artwork.original_width : undefined}
                  height={variant === "masonry" ? artwork.original_height : undefined}
                  containerClassName={cn(
                     "w-full h-full object-cover select-none transition-transform duration-700 md:group-hover:scale-105",
                     variant === "default" ? "aspect-square" : "h-auto"
                  )}
                  sizes={variant === "masonry" ? masonrySizes : defaultSizes}
               />
            </Link>

            {/* Actions */}
            {shouldShowLike && (
               <button
                  className="absolute top-3 right-3 z-20 text-red-500 hover:text-red-600 focus:outline-none md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300"
                  onClick={handleLike}
                  aria-label="Like artwork"
               >
                  <Heart size={20} className={cn(isLiked ? "fill-red-500" : "fill-none")} />
               </button>
            )}
         </div>

         {/* Artwork Info */}
         {!pure && (
            <div className="pt-2.5 space-y-1.5">
               <div className="space-y-0.5">
                  <Link to={paths.artworks.detail.getHref(artwork.id)} onClick={handleOnClick}>
                     <h3 className="font-semibold text-sm hover:text-primary transition-colors font-display line-clamp-1 leading-snug">
                        {artwork.title}
                     </h3>
                  </Link>
                  {artwork.artist_name && (
                     <p className="text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wider truncate">
                        {artwork.artist_name}
                     </p>
                  )}
                  {(categoryName || artwork.dimensions) && (
                     <div className="flex items-center gap-1.5 flex-wrap text-[10px] text-muted-foreground">
                        {categoryName && (
                           <span className="font-medium text-foreground/80 truncate">
                              {categoryName}
                           </span>
                        )}
                        {categoryName && artwork.dimensions && (
                           <span className="text-muted-foreground/40 shrink-0">·</span>
                        )}
                        {artwork.dimensions && (
                           <span className="truncate">
                              {artwork.dimensions}
                           </span>
                        )}
                     </div>
                  )}
               </div>

               {shouldShowStatus && statusConfig && (
                  <div className="flex items-center">
                     <span
                        className={cn(
                           "inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-medium border shrink-0 tracking-tight select-none leading-none",
                           statusConfig.badgeClass
                        )}
                     >
                        {statusConfig.label}
                     </span>
                  </div>
               )}

               {!(artwork.hide_price || !artwork.price || Number(artwork.price) <= 0) ? (
                  <div className="flex justify-between items-center">
                     <span className="font-semibold text-sm text-foreground leading-tight">
                        <Price
                           currency={artwork.currency}
                           price={artwork.price}
                           uniform
                           size="sm"
                        />
                     </span>
                  </div>
               ) : (
                  <Button
                     size="sm"
                     variant="secondary"
                     disabled
                     className="w-full mt-2 text-[10px] font-bold uppercase tracking-widest h-8"
                  >
                     {t("inquiryOnly")}
                  </Button>
               )}
            </div>
         )}
      </div>
   );
};

export default React.memo(ArtworkCard, (prevProps, nextProps) => {
   return (
      prevProps.artwork.id === nextProps.artwork.id &&
      prevProps.artwork.is_liked === nextProps.artwork.is_liked &&
      prevProps.artwork.status === nextProps.artwork.status &&
      prevProps.artwork.price === nextProps.artwork.price &&
      prevProps.artwork.title === nextProps.artwork.title &&
      prevProps.artwork.image === nextProps.artwork.image &&
      (prevProps.artwork.category_name || prevProps.artwork.category?.name) ===
         (nextProps.artwork.category_name || nextProps.artwork.category?.name) &&
      prevProps.artwork.dimensions === nextProps.artwork.dimensions &&
      prevProps.className === nextProps.className &&
      prevProps.variant === nextProps.variant &&
      prevProps.publicCard === nextProps.publicCard &&
      prevProps.pure === nextProps.pure &&
      prevProps.showLikeButton === nextProps.showLikeButton &&
      prevProps.showStatus === nextProps.showStatus
   );
});
