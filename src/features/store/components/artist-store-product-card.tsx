"use client";

import { paths } from "@/config/paths";
import Link from "@/components/common/link";
import type { Product } from "@/types";
import { ProductPreview } from "./product-preview";

type ArtistStoreProductCardProps = {
   product: Product;
};

const formatPrice = (price: string, currency: string) => {
   const numeric = Number(price);
   const amount = Number.isFinite(numeric)
      ? numeric.toLocaleString("en-US", { maximumFractionDigits: 0 })
      : price;
   return `${amount} ${currency}`.trim();
};

/**
 * Compact merch card for the Artist Detail Store tab: the layered preview of the
 * first active colourway plus the price MAS sells it at, linking to the public
 * store detail route. MAS owns pricing and fulfilment, so nothing here is an
 * artist listing control.
 */
export const ArtistStoreProductCard = ({
   product,
}: ArtistStoreProductCardProps) => {
   const activeVariant = product.variants.find((variant) => variant.is_active);
   const previewImage = product.hero_url || product.artwork_image_url;

   return (
      <Link
         to={paths.store.detail.getHref(product.id)}
         className="group flex flex-col gap-2"
      >
         <ProductPreview
            mockupUrl={activeVariant?.mockup_url ?? null}
            artworkUrl={previewImage}
            previewConfig={product.preview_config}
            colorHex={activeVariant?.color_hex ?? null}
            alt={product.title}
            className="transition-opacity group-hover:opacity-90"
         />
         <div className="space-y-0.5 px-0.5">
            <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2">
               {product.title}
            </p>
            <p className="text-[11px] text-muted-foreground">
               {formatPrice(product.price, product.currency)}
               {activeVariant?.size ? ` - Size ${activeVariant.size}` : ""}
            </p>
         </div>
      </Link>
   );
};

export default ArtistStoreProductCard;
