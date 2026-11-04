"use client";

import { useMemo } from "react";
import { RefreshCw, ShoppingBag } from "lucide-react";

import { EmptyState } from "@/components/common/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Product, ProductType } from "@/types";

import { useGetProductTypes } from "../api/get-product-types";
import { useGetProducts } from "../api/get-products";
import { ProductCard } from "../components/product-card";

/**
 * DRF caps `limit` at 100 and phase 1 is a hand-curated catalogue, so one request
 * fills the whole browse screen; a paginated shelf is a later concern.
 */
const CATALOGUE_LIMIT = 100;

type StoreGroup = {
   id: string;
   name: string;
   products: Product[];
};

/**
 * Shapes come from the product type list, which owns both the display name and
 * the catalogue order. Any product whose shape is missing from that list still
 * gets a trailing section rather than silently vanishing from the storefront.
 */
const groupProductsByType = (products: Product[], types: ProductType[]): StoreGroup[] => {
   const buckets = new Map<string, Product[]>();

   for (const product of products) {
      const typeId = product.product_type?.id || "untyped";
      const bucket = buckets.get(typeId);
      if (bucket) {
         bucket.push(product);
      } else {
         buckets.set(typeId, [product]);
      }
   }

   const groups: StoreGroup[] = [];
   const claimed = new Set<string>();

   for (const type of types) {
      const bucket = buckets.get(type.id);
      if (!bucket || bucket.length === 0) continue;
      claimed.add(type.id);
      groups.push({ id: type.id, name: type.name, products: bucket });
   }

   for (const [typeId, bucket] of buckets) {
      if (claimed.has(typeId)) continue;
      groups.push({
         id: typeId,
         name: bucket[0]?.product_type?.name || "More From The Store",
         products: bucket,
      });
   }

   return groups;
};

const CardGridSkeleton = ({ count = 4 }: { count?: number }) => (
   <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
         <div key={index} className="space-y-2">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
         </div>
      ))}
   </div>
);

const StorePageSkeleton = () => (
   <div className="space-y-8" aria-busy="true">
      <div className="space-y-2">
         <Skeleton className="h-8 w-44" />
         <Skeleton className="h-4 w-64" />
      </div>
      <div className="space-y-3">
         <Skeleton className="h-6 w-32" />
         <CardGridSkeleton />
      </div>
      <div className="space-y-3">
         <Skeleton className="h-6 w-32" />
         <CardGridSkeleton count={2} />
      </div>
   </div>
);

const StorePage = () => {
   const {
      data: productsData,
      isLoading,
      isError,
      refetch,
      isFetching,
   } = useGetProducts({ filters: { limit: CATALOGUE_LIMIT } });

   const { data: productTypesData } = useGetProductTypes();

   const types = useMemo(
      () =>
         [...(productTypesData?.results ?? [])].sort(
            (a, b) => a.sort_order - b.sort_order,
         ),
      [productTypesData],
   );

   const products = productsData?.results ?? [];
   const groups = useMemo(() => groupProductsByType(products, types), [products, types]);

   return (
      <div className="w-full pb-12">
         <header className="mb-6 space-y-1.5">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
               MAS Store
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
               Paintings from the platform, printed on tees, totes, mugs and books. Every
               purchase pays the artist a share.
            </p>
         </header>

         {isLoading ? (
            <StorePageSkeleton />
         ) : isError ? (
            <EmptyState
               icon={ShoppingBag}
               title="The store is unavailable"
               description="We could not load the catalogue. Check your connection and try again."
               action={
                  <Button
                     type="button"
                     variant="outline"
                     size="sm"
                     className="h-10 gap-1.5 px-4 font-semibold"
                     disabled={isFetching}
                     onClick={() => refetch()}
                  >
                     <RefreshCw className="size-4" />
                     Try again
                  </Button>
               }
            />
         ) : groups.length === 0 ? (
            <EmptyState
               icon={ShoppingBag}
               title="Nothing on the shelves yet"
               description="New printed pieces go live as soon as an artist licenses their work. Check back soon."
            />
         ) : (
            <div className="space-y-9">
               {groups.map((group) => (
                  <section key={group.id} className="space-y-3">
                     <div className="flex items-baseline justify-between gap-3">
                        <h2 className="text-lg font-semibold tracking-tight text-foreground sm:text-xl">
                           {group.name}
                        </h2>
                        <span className="text-xs text-muted-foreground">
                           {group.products.length}{" "}
                           {group.products.length === 1 ? "item" : "items"}
                        </span>
                     </div>

                     <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                        {group.products.map((product) => (
                           <ProductCard key={product.id} product={product} />
                        ))}
                     </div>
                  </section>
               ))}
            </div>
         )}
      </div>
   );
};

export default StorePage;
