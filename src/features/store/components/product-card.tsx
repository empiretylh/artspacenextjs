"use client";

import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import Price from "@/components/common/price";
import { paths } from "@/config/paths";
import { cn, getImage } from "@/lib/utils";
import type { Currency, Product } from "@/types";

type ProductCardProps = {
   product: Product;
   sizes?: string;
   className?: string;
};

/**
 * Store payloads carry a bare currency code while <Price> expects a Currency
 * row, so the card adapts the shape instead of re-implementing the formatter.
 */
export const toPriceCurrency = (code?: string | null): Currency => ({
   code: code || "MMK",
   name: code || "MMK",
   numeric_code: "",
   symbol: "",
});

/**
 * Grid tile for one printed item. The hero shot is admin-curated; until they
 * upload one the artwork itself stands in, which is the honest preview of what
 * the print shows.
 */
export const ProductCard = ({ product, sizes, className }: ProductCardProps) => {
   const href = paths.store.detail.getHref(product.id);
   const image = getImage(product.hero_url || product.artwork_image_url);

   return (
      <div
         className={cn(
            "group flex h-full w-full flex-col overflow-hidden rounded-xl border border-border/60 bg-card/60 shadow-2xs transition-all hover:border-border hover:shadow-sm",
            className,
         )}
      >
         <Link to={href} className="block shrink-0">
            <div className="relative aspect-square w-full overflow-hidden bg-muted/30">
               <AppImage
                  src={image}
                  alt={product.title}
                  sizes={sizes || "(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"}
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
               />
            </div>
         </Link>

         <div className="flex flex-1 flex-col gap-1 p-3">
            <Link to={href} className="min-w-0">
               <h3 className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                  {product.title}
               </h3>
            </Link>

            {product.product_type?.name && (
               <p className="truncate text-xs text-muted-foreground">
                  {product.product_type.name}
               </p>
            )}

            <div className="mt-auto flex items-baseline justify-between gap-2 pt-1.5">
               <Price
                  price={product.price}
                  currency={toPriceCurrency(product.currency)}
                  size="sm"
                  className="font-semibold"
               />
               {product.artist_name && (
                  <p className="min-w-0 truncate text-xs text-muted-foreground">
                     {product.artist_name}
                  </p>
               )}
            </div>
         </div>
      </div>
   );
};

export default ProductCard;
