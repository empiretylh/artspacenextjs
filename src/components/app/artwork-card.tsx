'use client'
import { paths } from "@/config/paths";
import { cn, getImage } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, Plus, Square, CheckSquare } from "lucide-react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import type { Artwork } from "@/types";
import Image from "../common/image";
import Link from "../common/link";
import { useLike } from "@/hooks/app/use-like";
import AppImage from "../common/app-image";

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
   const { isLiked, handleLike, isMutating } = useLike({
      artworkId: String(artwork.id),
      initialLiked: artwork.is_liked,
   });

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

   if (!artwork.original_width || !artwork.original_height) return null

   return (
      <div style={style} className={cn("relative w-full", className)}>
         {/* Image + Hover Buttons */}

         <div className="relative group rounded-md overflow-hidden cursor-pointer">
            <div className="lg:hidden absolute z-10 inset-0 bg-gradient-to-b rounded-md from-black/40 via-transparent to-transparent" />
            <Link to={paths.artworks.detail.getHref(artwork.id)}>
               <div
                  title={artwork.title}
                  className="w-full h-full z-10 group-hover:bg-black/40 absolute transition-colors duration-200"
               ></div>
               <AppImage
                  src={getImage(artwork.image)}
                  alt={artwork.title}
                  title={artwork.title}
                  containerStyle={{
                     aspectRatio: `auto ${artwork.original_width} / ${artwork.original_height}`,
                  }}
                  width={artwork.original_width}
                  height={artwork.original_height}
                  containerClassName={cn(
                     "w-full object-cover h-auto cursor-pointer select-none border rounded-md overflow-hidden",
                     variant === "default" && "h-[240px] min-w-[115px]"
                  )}
                  sizes={variant === "masonry" ? masonrySizes : defaultSizes}
                  onClick={() =>
                     router.push(paths.artworks.detail.getHref(artwork.id))
                  }
               />
            </Link>
            {/* Hover Buttons */}
            {publicCard && !pure && (
               <div className="absolute inset-x-0 top-2 z-10 flex justify-between px-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  {/* Collection Popover */}
                  <Popover>
                     <PopoverTrigger asChild>
                        <Button size="icon" className="text-white" variant="ghost" disabled>
                           <Plus size={16} />
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent
                        side="bottom"
                        className="w-48 p-2 space-y-2"
                     >
                        <p className="text-xs font-medium text-muted-foreground">
                           Save to collection
                        </p>
                        <div className="space-y-1 max-h-40 overflow-y-auto">
                           {collections.map((col) => {
                              const checked = col.items.includes(artwork.id);
                              return (
                                 <Button
                                    key={col.id}
                                    variant="ghost"
                                    size="sm"
                                    className="w-full justify-start gap-2"
                                    onClick={() => toggleCollection(col.id)}
                                 >
                                    {checked ? (
                                       <CheckSquare size={16} />
                                    ) : (
                                       <Square size={16} />
                                    )}
                                    <span className="text-sm">{col.name}</span>
                                 </Button>
                              );
                           })}
                        </div>
                        <Button
                           variant="link"
                           size="sm"
                           className="flex items-center gap-1"
                           onClick={createCollection}
                        >
                           <Plus size={14} /> New Collection
                        </Button>
                     </PopoverContent>
                  </Popover>

                  {/* Like Button */}
                  <Button
                     size="icon"
                     variant="ghost"
                     onClick={handleLike}
                  // disabled={isMutating}
                  // asChild
                  >
                     <Heart
                        size={12}
                        className={cn(
                           "hover:fill-red-400 text-red-400",
                           isLiked ? "fill-red-400" : "text-red-400 "
                        )}
                     />
                  </Button>
               </div>
            )}
         </div>

         {/* Artwork Info */}
         {!pure && (
            <div className="p-2 space-y-1">
               <Link to={paths.artworks.detail.getHref(artwork.id)}>
                  <h3 className="font-semibold hover:underline font-display text-sm truncate">
                     {artwork.title}
                  </h3>
               </Link>

               <p className="text-xs text-muted-foreground truncate">
                  {artwork.dimensions}
               </p>

               {artwork.category_name && (
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded">
                     {artwork.category_name}
                  </span>
               )}

               {!artwork.hide_price && (
                  <div className="flex justify-between items-center pt-2 text-sm">
                     <span className="font-bold text-foreground">
                        ${artwork.price}
                     </span>
                  </div>
               )}
               {artwork.hide_price && (
                  <Button
                     size="sm"
                     disabled
                     className="block w-full mt-1 !py-1 bg-primary/30 hover:bg-primary/40 text-primary text-xs"
                  >
                     Request for price
                  </Button>
               )}
            </div>
         )}
      </div>
   );
};

export default ArtworkCard;
