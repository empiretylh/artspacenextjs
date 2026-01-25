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

const ArtworkDetailPage = ({ id }: { id: string }) => {
   const artworkQuery = useGetArtwork({ artworkId: id });
   const artwork = artworkQuery.data?.data;

   if (artworkQuery.isLoading) {
      return <ArtworkDetailPageSkeleton />;
   }

   if (!artwork) {
      return (
         <main className="container mx-auto grow px-4 py-8 md:py-12 text-center text-muted-foreground">
            Artwork not found
         </main>
      );
   }

   return (
      <div>
         <h1 className="text-2xl font-medium mb-2">{artwork.title}</h1>
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
            {/* Main Image + Characteristics */}
            <div className="lg:col-span-2 space-y-6">
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
               />

               {artwork.search_keywords &&
                  artwork.search_keywords.length > 0 && (
                     <>
                        <h1 className="font-bold text-lg mb-2">Keywords</h1>
                        <div className="space-x-2 space-y-2">
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
               <h1 className="font-bold text-lg mb-2">Description</h1>
               <p className="text-base text-foreground/80">
                  {artwork.description}
               </p>

               <ArtistProfile artist={artwork.artist_profile} />
            </div>

            {/* Purchase Info + Artist */}
            <div className="lg:col-span-1 space-y-6 sticky top-16 self-start">
               <ProductInfoCard artwork={artwork} />
            </div>
         </div>

         {/* Related Artworks */}
         <RelatedArtworkListContainer artwork={artwork} />
      </div>
   );
};

export default ArtworkDetailPage;
