'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetArtwork } from "@/features/service/artspace/get-artwork";
import "viewerjs/dist/viewer.css";
import { ArtistProfile } from "../components/artist-profile";
import { ArtworkCharacteristicsCard } from "../components/artwork-characteristics-card";
import ArtworkDetailMore from "../components/artwork-detail-more";
import ArtworkImage from "../components/artwork-image";
import { ProductInfoCard } from "../components/product-info-card";
import RelatedArtworkListContainer from "../components/related-artwork-list-container";
import ArtworkDetailPageSkeleton from "./artwork-skeleton";
import { Suspense, useEffect } from "react";
import LoadingPage from "@/components/page/loading-page";
import { notFound } from "next/navigation";
import { ecommerceAnalytics, itemFromArtwork } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";

const ArtworkDetailPage = ({ id }: { id: string }) => {
   const artworkQuery = useGetArtwork({ artworkId: id });
   const artwork = artworkQuery.data;
   const { source } = useSource()

   useEffect(() => {
      if (artwork) {
         const item = itemFromArtwork(artwork);
         ecommerceAnalytics.viewItem(artwork.currency.code || 'MMK', Number(artwork.price), [item], source)
      }
   }, [artwork]);

   if (artworkQuery.isLoading) {
      return <ArtworkDetailPageSkeleton />;
   }

   if (!artwork) {
      return notFound();
   }

   return (
      <section aria-labelledby="artwork-title">
         <h1 id="artwork-title" className="text-2xl font-medium mb-4 md:mb-6 font-display">
            {artwork.title}
         </h1>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Main Image + Characteristics */}
            <section className="lg:col-span-2 space-y-6" aria-label="Artwork details">
               {/* <ArtworkImageCarousel images={[artwork.image]} /> */}

               <div className="relative border p-2 rounded-lg">
                  <ArtworkImage artwork={artwork} />
                  <div className="flex justify-center absolute top-2 right-2">
                     {/* <ReportButton
                           itemId={artwork.id}
                           reportType="artwork"
                        /> */}
                     <ArtworkDetailMore artwork={artwork} />
                  </div>
               </div>

               <ArtworkCharacteristicsCard
                  year={artwork.year}
                  styles={artwork.artwork_styles}
                  dimensions={artwork.dimensions || "N/A"}
                  medium={artwork.medium || "N/A"}
                  category={artwork.category}
                  categoryName={artwork.category_name}
                  artistName={artwork.artist_name || "N/A"}
                  currentOwner={artwork.current_owner_name ? artwork.current_owner_name : artwork.current_owner_display?.first_name + " " + artwork.current_owner_display?.last_name}
               />

               {artwork.search_keywords &&
                  artwork.search_keywords.length > 0 && (
                     <>
                        <h2 className="font-bold text-xl mb-2 font-display">Keywords</h2>
                        <div className="space-x-2 space-y-2" aria-label="Artwork keywords">
                           {artwork.search_keywords.map((kw) => (
                              <Button
                                 key={kw}
                                 variant={"outline"}
                                 className="rounded-lg"
                              >
                                 {kw}
                              </Button>
                           ))}
                        </div>
                     </>
                  )}

               {/* Mobile Description */}
               <section aria-labelledby="artwork-description">
                  <h2 id="artwork-description" className="font-bold text-xl mb-2 font-display">
                     Description
                  </h2>
                  <p className="text-base text-foreground/80">
                     {artwork.description || "N/A"}
                  </p>
               </section>

               {
                  artwork.artist_profile && (
                     <ArtistProfile artist={artwork.artist_profile} />
                  )
               }
            </section>

            {/* Purchase Info + Artist */}
            <aside
               className="lg:col-span-1 space-y-6 sticky top-16 self-start"
               aria-label="Purchase details"
            >
               <ProductInfoCard artwork={artwork} />
            </aside>
         </div>

         {/* Related Artworks */}
         <section aria-label="Related artworks">
            <Suspense fallback={<LoadingPage />}>
               <RelatedArtworkListContainer artwork={artwork} />
            </Suspense>
         </section>
      </section>
   );
};

export default ArtworkDetailPage;
