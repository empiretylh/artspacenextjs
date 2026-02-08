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
import { useAuth } from "@/features/auth/store";
import { Suspense, useEffect } from "react";
import LoadingPage from "@/components/page/loading-page";
import { notFound } from "next/navigation";
import { artworkAnalytics } from "@/lib/analytics";

const ArtworkDetailPage = ({ id }: { id: string }) => {
   const artworkQuery = useGetArtwork({ artworkId: id });
   const artwork = artworkQuery.data;

   useEffect(() => {
      if (artwork) {
         artworkAnalytics.view(artwork.id, {
            artistId: String(artwork.artist_profile.id),
            category: String(artwork.category.id),
            source: "artwork_detail"
         })
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
         <h1 id="artwork-title" className="text-2xl font-medium mb-2">
            {artwork.title}
         </h1>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Main Image + Characteristics */}
            <section className="lg:col-span-2 space-y-6" aria-label="Artwork details">
               {/* <ArtworkImageCarousel images={[artwork.image]} /> */}

               <Card className="h-100 relative">
                  <CardContent>
                     <ArtworkImage artwork={artwork} />
                     <div className="flex justify-center absolute top-2 right-2">
                        {/* <ReportButton
                           itemId={artwork.id}
                           reportType="artwork"
                        /> */}
                        <ArtworkDetailMore artwork={artwork} />
                     </div>
                  </CardContent>
               </Card>

               <ArtworkCharacteristicsCard
                  title={artwork.title}
                  year={artwork.year}
                  styles={artwork.artwork_styles}
                  dimensions={artwork.dimensions || "N/A"}
                  medium={artwork.medium || "N/A"}
                  category={artwork.category}
                  categoryName={artwork.category_name}
                  currentOwner={artwork.current_owner_name ? artwork.current_owner_name : artwork.current_owner_display.first_name + " " + artwork.current_owner_display.last_name}
               />

               {artwork.search_keywords &&
                  artwork.search_keywords.length > 0 && (
                     <>
                        <h2 className="font-bold text-lg mb-2">Keywords</h2>
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
                  <h2 id="artwork-description" className="font-bold text-lg mb-2">
                     Description
                  </h2>
                  <p className="text-base text-foreground/80">
                     {artwork.description}
                  </p>
               </section>

               <ArtistProfile artist={artwork.artist_profile} />
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
