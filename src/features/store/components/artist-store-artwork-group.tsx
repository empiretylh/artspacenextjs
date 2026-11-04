"use client";

import { paths } from "@/config/paths";
import Link from "@/components/common/link";
import { getImage } from "@/lib/utils";
import type { Product } from "@/types";
import { ArtistStoreProductCard } from "./artist-store-product-card";

type ArtistStoreArtworkGroupProps = {
   /** One artwork and every published merch item printed from it. */
   artworkId: string;
   artworkTitle: string;
   artworkImageUrl: string | null;
   products: Product[];
};

/**
 * Merch items are one artwork x product type pair, so the artist Store tab groups
 * by artwork first and then splits that artwork's items by product type. Each
 * group is ordered by the admin sort_order on the product type.
 */
export const ArtistStoreArtworkGroup = ({
   artworkId,
   artworkTitle,
   artworkImageUrl,
   products,
}: ArtistStoreArtworkGroupProps) => {
   const typeGroups = products.reduce<Record<string, Product[]>>((acc, product) => {
      const key = product.product_type?.name || "Other";
      (acc[key] ??= []).push(product);
      return acc;
   }, {});

   const orderedTypeNames = Object.keys(typeGroups).sort((a, b) => {
      const sortOf = (name: string) =>
         typeGroups[name][0]?.product_type?.sort_order ?? Number.MAX_SAFE_INTEGER;
      return sortOf(a) - sortOf(b);
   });

   return (
      <section className="space-y-4">
         <div className="flex items-center gap-3">
            <Link
               to={paths.artworks.detail.getHref(artworkId)}
               className="shrink-0"
               aria-label={`Open ${artworkTitle}`}
            >
               <img
                  src={getImage(artworkImageUrl)}
                  alt={artworkTitle}
                  className="size-12 rounded-sm object-cover border border-border/60"
                  loading="lazy"
               />
            </Link>
            <div className="min-w-0 space-y-0.5">
               <Link to={paths.artworks.detail.getHref(artworkId)}>
                  <h3 className="truncate text-sm font-semibold text-foreground hover:text-primary transition-colors">
                     {artworkTitle}
                  </h3>
               </Link>
               <p className="text-[11px] text-muted-foreground">
                  {products.length} {products.length === 1 ? "store item" : "store items"}
               </p>
            </div>
         </div>

         <div className="space-y-5 pl-1">
            {orderedTypeNames.map((typeName) => (
               <div key={typeName} className="space-y-2.5">
                  <h4 className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                     {typeName}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                     {typeGroups[typeName].map((product) => (
                        <ArtistStoreProductCard
                           key={product.id}
                           product={product}
                        />
                     ))}
                  </div>
               </div>
            ))}
         </div>
      </section>
   );
};

export default ArtistStoreArtworkGroup;
