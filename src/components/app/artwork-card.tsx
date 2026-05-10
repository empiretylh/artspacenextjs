'use client'
import { paths } from "@/config/paths";
import { cn, getImage, snakeToNormal } from "@/lib/utils";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
}

const ArtworkCard: React.FC<ArtworkCardProps> = ({
   artwork,
   className,
   variant = "default",
   style,
   publicCard = true,
   pure = false,
}) => {
   const { isLiked, handleLike } = useLike({
      artworkId: String(artwork.id),
      initialLiked: artwork.is_liked,
   });
   const { source } = useSource();
   const router = useRouter();
   const [collections, setCollections] = useState<
      {
         id: number;
         name: string;
         items: string[];
      }[]
   >([
      { id: 1, name: "Favorites", items: [] },
      { id: 2, name: "Inspiration", items: [] },
   ]);

   const toggleCollection = (collectionId: number) => {
      alert("toggle collection " + collectionId);
   };

   const createCollection = () => {
      const name = prompt("Collection name?");
      if (!name) return;
      setCollections((prev) => [...prev, { id: Date.now(), name, items: [] }]);
   };

   const masonrySizes = "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, (max-width: 1536px) 20vw, 300px";
   const defaultSizes = "(max-width: 768px) 100vw, 400px"; // Adjust based on your fixed-height row layout

   const handleOnClick = () => {
      const item = itemFromArtwork(artwork);
      ecommerceAnalytics.select_item(source, snakeToNormal(source), [item], source);
   }

   // if (!artwork.original_width || !artwork.original_height) return null

   return (
      <div style={style} className={cn("group relative w-full overflow-hidden transition-all duration-500", className)}>
         {/* Image + Hover Buttons */}

         <div className="relative aspect-square overflow-hidden rounded-sm cursor-pointer">
            {artwork.status !== "AVAILABLE" && (
               <div className="absolute top-3 left-3 z-20 pointer-events-none">
                  <Badge variant="secondary" className="bg-white/90 md:backdrop-blur-md text-black border-none text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm">
                     {artwork.status === "SOLD" ? "SOLD" :
                        artwork.status === "SOLD_OUT" ? "SOLD OUT" :
                           artwork.status === "NOT_FOR_SALE" ? "NOT FOR SALE" : artwork.status}
                  </Badge>
               </div>
            )}
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
            {publicCard && !pure && (
               <div className="absolute bottom-3 right-3 z-20 flex gap-2 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100">
                  <Button
                     size="icon"
                     className="h-8 w-8 rounded-full bg-white/90 md:backdrop-blur-md border border-black/5 hover:bg-white text-black shadow-sm"
                     onClick={handleLike}
                  >
                     <Heart size={14} className={cn(isLiked && "fill-red-500 text-red-500")} />
                  </Button>
               </div>
            )}
         </div>

         {/* Artwork Info */}
         {!pure && (
            <div className="pt-3 space-y-1.5">
               <div className="space-y-0">
                  <Link to={paths.artworks.detail.getHref(artwork.id)} onClick={handleOnClick}>
                     <h3 className="font-bold text-sm hover:text-primary transition-colors font-display line-clamp-1">
                        {artwork.title}
                     </h3>
                  </Link>
                  <p className="text-[10px] font-medium text-muted-foreground/80 uppercase tracking-wider">
                     {artwork.artist_name}
                  </p>
               </div>

               <div className="flex items-center gap-1.5 flex-wrap">
                  {artwork.category_name && (
                     <span className="text-[9px] font-bold text-primary/80 bg-primary/5 border border-primary/10 px-1.5 py-0.5 rounded-full">
                        {artwork.category_name}
                     </span>
                  )}
                  <span className="text-[9px] text-muted-foreground">
                     {artwork.dimensions}
                  </span>
               </div>

               {!artwork.hide_price && (
                  <div className="flex justify-between items-center pt-0.5">
                     <span className="font-black text-base text-foreground tracking-tight">
                        <Price currency={artwork.currency} price={artwork.price} uniform size="sm" />
                     </span>
                  </div>
               )}
               {artwork.hide_price && (
                  <Button
                     size="sm"
                     variant="secondary"
                     disabled
                     className="w-full mt-2 text-[10px] font-bold uppercase tracking-widest h-8"
                  >
                     Inquiry Only
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
      prevProps.className === nextProps.className &&
      prevProps.variant === nextProps.variant &&
      prevProps.publicCard === nextProps.publicCard &&
      prevProps.pure === nextProps.pure
   );
});
