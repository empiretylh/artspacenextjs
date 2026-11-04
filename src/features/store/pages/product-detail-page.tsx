"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ShoppingBag } from "lucide-react";

import Link from "@/components/common/link";
import Price from "@/components/common/price";
import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

import { useGetProduct } from "../api/get-products";
import {
   ColorwaySelector,
   colorwayKeyOf,
   getColorwayOptions,
} from "../components/colorway-selector";
import { toPriceCurrency } from "../components/product-card";
import { ProductPreview } from "../components/product-preview";
import { StoreOrderForm } from "../components/store-order-form";

type ProductDetailPageProps = {
   productId: string;
};

/** Size chips share the swatch interaction rules, so they live beside them. */
const SizeSelector = ({
   options,
   selected,
   onSelect,
   className,
}: {
   options: string[];
   selected: string;
   onSelect: (size: string) => void;
   className?: string;
}) => {
   if (options.length === 0) return null;

   return (
      <div className={cn("space-y-2", className)}>
         <div className="flex items-baseline justify-between gap-2">
            <span id="store-size-label" className="text-sm font-semibold text-foreground">
               Size
            </span>
            <span className="text-xs text-muted-foreground">{selected || "One size"}</span>
         </div>
         <div role="group" aria-labelledby="store-size-label" className="flex flex-wrap gap-2">
            {options.map((size) => {
               const isSelected = size === selected;
               return (
                  <button
                     key={size}
                     type="button"
                     aria-pressed={isSelected}
                     onClick={() => onSelect(size)}
                     className={cn(
                        "h-11 min-w-11 rounded-lg border px-3 text-sm font-semibold outline-none transition-all",
                        "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        isSelected
                           ? "border-primary bg-primary/10 text-primary"
                           : "border-border/60 bg-background text-foreground hover:border-border hover:bg-muted/40",
                     )}
                  >
                     {size}
                  </button>
               );
            })}
         </div>
      </div>
   );
};

const ProductDetailSkeleton = () => (
   <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8" aria-busy="true">
      <div className="space-y-4">
         <Skeleton className="aspect-square w-full rounded-2xl" />
         <div className="flex gap-2.5">
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
            <Skeleton className="size-10 rounded-full" />
         </div>
      </div>
      <div className="space-y-4">
         <Skeleton className="h-4 w-24" />
         <Skeleton className="h-8 w-2/3" />
         <Skeleton className="h-6 w-32" />
         <div className="space-y-2 pt-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-3/5" />
         </div>
         <Skeleton className="h-56 w-full rounded-xl" />
      </div>
   </div>
);

const ProductDetailPage = ({ productId }: ProductDetailPageProps) => {
   const { data: product, isLoading, isError } = useGetProduct({ productId });

   const variants = useMemo(
      () => [...(product?.variants ?? [])].sort((a, b) => a.sort_order - b.sort_order),
      [product],
   );

   const colorwayOptions = useMemo(() => getColorwayOptions(variants), [variants]);
   const sizeOptions = useMemo(
      () => Array.from(new Set(variants.map((variant) => variant.size).filter(Boolean))),
      [variants],
   );

   const [selectedColorKey, setSelectedColorKey] = useState<string | null>(null);
   const [selectedSize, setSelectedSize] = useState<string | null>(null);

   // Selections are resolved against the payload rather than stored as variants,
   // so a refetch that drops a colourway falls back instead of blanking the preview.
   const activeColorKey = colorwayOptions.some((option) => option.key === selectedColorKey)
      ? (selectedColorKey as string)
      : (colorwayOptions[0]?.key ?? "");
   const activeSize = sizeOptions.includes(selectedSize ?? "")
      ? (selectedSize ?? "")
      : (sizeOptions[0] ?? "");

   const isColorable = product?.is_colorable ?? false;

   const selectedVariant = useMemo<ProductVariant | null>(() => {
      if (variants.length === 0) return null;
      if (!isColorable) {
         return variants.find((variant) => (variant.size || "") === activeSize) ?? variants[0];
      }
      return (
         variants.find(
            (variant) =>
               colorwayKeyOf(variant) === activeColorKey && (variant.size || "") === activeSize,
         ) ??
         variants.find((variant) => colorwayKeyOf(variant) === activeColorKey) ??
         variants[0]
      );
   }, [variants, isColorable, activeColorKey, activeSize]);

   const handleSelectColor = (key: string) => {
      setSelectedColorKey(key);

      // Sizes are per colourway, so carry the size over only when that colour
      // actually offers it and snap to its first size otherwise.
      const keepsSize = variants.some(
         (variant) => colorwayKeyOf(variant) === key && (variant.size || "") === activeSize,
      );
      if (!keepsSize) {
         setSelectedSize(variants.find((variant) => colorwayKeyOf(variant) === key)?.size || "");
      }
   };

   const royaltyPercent = Number(product?.royalty_percent);

   if (isLoading) {
      return (
         <div className="w-full pb-12">
            <div className="mb-4">
               <Link
                  to={paths.store.getHref()}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground"
               >
                  <ArrowLeft className="size-4" />
                  Back to store
               </Link>
            </div>
            <ProductDetailSkeleton />
         </div>
      );
   }

   if (isError || !product) {
      return (
         <div className="w-full pb-12">
            <EmptyState
               icon={ShoppingBag}
               title="This piece is off the shelf"
               description="The item is unpublished, the artist withdrew merch rights, or the link is out of date."
               action={
                  <Button asChild size="sm" className="h-10 px-4 font-semibold">
                     <Link to={paths.store.getHref()}>Back to store</Link>
                  </Button>
               }
            />
         </div>
      );
   }

   return (
      <div className="w-full pb-12">
         <div className="mb-4">
            <Link
               to={paths.store.getHref()}
               className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
               <ArrowLeft className="size-4" />
               Back to store
            </Link>
         </div>

         <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2 lg:gap-8">
            {/* Preview column: the colourway drives the mockup, tint and print. */}
            <div className="space-y-5 lg:sticky lg:top-20">
               <ProductPreview
                  mockupUrl={selectedVariant?.mockup_url}
                  artworkUrl={product.artwork_image_url}
                  previewConfig={product.preview_config}
                  colorHex={selectedVariant?.color_hex}
                  alt={product.title}
                  className="rounded-2xl"
               />

               {isColorable && colorwayOptions.length > 0 && (
                  <ColorwaySelector
                     variants={variants}
                     selectedKey={activeColorKey}
                     onSelect={handleSelectColor}
                  />
               )}

               {sizeOptions.length > 0 && (
                  <SizeSelector
                     options={sizeOptions}
                     selected={activeSize}
                     onSelect={(size) => setSelectedSize(size)}
                  />
               )}
            </div>

            {/* Detail column: identity, provenance and the Buy Now block. */}
            <div className="space-y-5">
               <div className="space-y-2">
                  {product.product_type?.name && (
                     <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {product.product_type.name}
                     </p>
                  )}
                  <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                     {product.title}
                  </h1>

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground">
                     <span>Printed from</span>
                     <Link
                        to={paths.artworks.detail.getHref(product.artwork)}
                        className="font-medium text-foreground underline-offset-4 hover:underline"
                     >
                        {product.artwork_title || "the artwork"}
                     </Link>
                     <span aria-hidden="true">-</span>
                     {product.artist !== null ? (
                        <Link
                           to={paths.artists.detail.getHref(String(product.artist))}
                           className="font-medium text-foreground underline-offset-4 hover:underline"
                        >
                           {product.artist_name || "the artist"}
                        </Link>
                     ) : (
                        <span>{product.artist_name || "Featured artist"}</span>
                     )}
                  </div>
               </div>

               <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-2xl font-semibold text-foreground">
                     <Price
                        price={selectedVariant?.price ?? product.price}
                        currency={toPriceCurrency(product.currency)}
                        size="lg"
                     />
                  </span>
                  {selectedVariant?.stock !== null &&
                     selectedVariant?.stock !== undefined && (
                        <span className="text-xs text-muted-foreground">
                           {selectedVariant.stock > 0
                              ? `${selectedVariant.stock} in stock`
                              : "Out of stock"}
                        </span>
                     )}
                  {Number.isFinite(royaltyPercent) && royaltyPercent > 0 && (
                     <span className="text-xs text-muted-foreground">
                        {royaltyPercent}% back to the artist
                     </span>
                  )}
               </div>

               {product.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                     {product.description}
                  </p>
               )}

               <StoreOrderForm product={product} variant={selectedVariant} />
            </div>
         </div>
      </div>
   );
};

export default ProductDetailPage;
