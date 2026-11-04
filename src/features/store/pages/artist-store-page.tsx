"use client";

import NotFound from "@/components/layout/not-found";
import { useProfileUser } from "@/components/providers/profile-user-provider";
import { normalizeListResponse } from "@/lib/utils";
import type { Product } from "@/types";
import { ShoppingBagIcon } from "lucide-react";
import { useGetProducts } from "../api/get-products";
import { ArtistStoreArtworkGroup } from "../components/artist-store-artwork-group";

type ArtworkGroup = {
   artworkId: string;
   artworkTitle: string;
   artworkImageUrl: string | null;
   products: Product[];
};

/**
 * Merch items are one artwork printed on one product shape, so the artist Store
 * tab groups the published catalogue by artwork first. The public list endpoint
 * already drops drafts, inactive product types, unlicensed artwork and private
 * artwork, so whatever arrives here is whatever the artist may show buyers.
 */
const groupByArtwork = (products: Product[]): ArtworkGroup[] => {
   const groups: ArtworkGroup[] = [];
   const indexById = new Map<string, ArtworkGroup>();

   for (const product of products) {
      const artworkId = product.artwork;
      if (!artworkId) continue;

      let group = indexById.get(artworkId);
      if (!group) {
         group = {
            artworkId,
            artworkTitle: product.artwork_title || "Untitled artwork",
            artworkImageUrl: product.artwork_image_url ?? null,
            products: [],
         };
         indexById.set(artworkId, group);
         groups.push(group);
      }
      group.products.push(product);
   }

   return groups;
};

const ArtistStorePage = () => {
   const { data: user } = useProfileUser();

   const { data, isLoading, isError } = useGetProducts({
      filters: { artist: user?.id, limit: 100 },
      enabled: Boolean(user?.id),
   });

   if (!user) {
      return <NotFound />;
   }

   const products = normalizeListResponse<Product>(data).results;
   const groups = groupByArtwork(products);

   if (isLoading) {
      return (
         <div className="space-y-6 py-2">
            {[0, 1].map((key) => (
               <div key={key} className="space-y-3">
                  <div className="size-12 rounded-sm bg-muted/40 animate-pulse" />
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                     {[0, 1, 2].map((item) => (
                        <div
                           key={item}
                           className="aspect-square rounded-xl bg-muted/30 animate-pulse"
                        />
                     ))}
                  </div>
               </div>
            ))}
         </div>
      );
   }

   if (isError) {
      return (
         <div className="rounded-xl border border-border/80 bg-muted/20 p-6 text-center">
            <p className="text-sm font-semibold text-foreground">
               The store list could not be loaded.
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
               Please refresh this page to try again.
            </p>
         </div>
      );
   }

   if (groups.length === 0) {
      return (
         <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/10 px-6 py-14 text-center">
            <ShoppingBagIcon className="size-8 text-muted-foreground/60" />
            <div className="space-y-1">
               <p className="text-sm font-semibold text-foreground">
                  No store items yet
               </p>
               <p className="mx-auto max-w-sm text-xs leading-relaxed text-muted-foreground">
                  Myanmar Art Space turns selected artworks into printed merch. Once
                  an artwork is licensed for merch rights on its edit form and an item
                  is published on it, it appears here.
               </p>
            </div>
         </div>
      );
   }

   return (
      <div className="space-y-8 py-2">
         <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Store</h2>
            <p className="text-xs text-muted-foreground">
               Physical products printed with this artist&apos;s artwork. Myanmar Art
               Space prints, ships and handles each order, and pays the artist a
               royalty on every sale.
            </p>
         </div>

         {groups.map((group) => (
            <ArtistStoreArtworkGroup
               key={group.artworkId}
               artworkId={group.artworkId}
               artworkTitle={group.artworkTitle}
               artworkImageUrl={group.artworkImageUrl}
               products={group.products}
            />
         ))}
      </div>
   );
};

export default ArtistStorePage;
