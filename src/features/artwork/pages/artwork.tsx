'use client'

import { Button } from "@/components/ui/button";
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
import { ArrowLeft, Heart } from "lucide-react";
import { useSafeBack } from "@/hooks/use-safe-back";
import { paths } from "@/config/paths";
import { useTranslations } from "next-intl";
import { useAuth } from "@/features/auth/store";
import { getUserDisplayName, cn } from "@/lib/utils";
import Link from "@/components/common/link";
import { useLike } from "@/hooks/app/use-like";

const ArtworkDetailPage = ({ id }: { id: string }) => {
   const t = useTranslations("Artwork.detail");
   const { goBack } = useSafeBack(paths.artworks.path);
   const artworkQuery = useGetArtwork({ artworkId: id });
   const artwork = artworkQuery.data;
   const { source } = useSource();
   const { loading: authLoading } = useAuth();

   const { isLiked, handleLike } = useLike({
      artworkId: String(id),
      initialLiked: Boolean(artwork?.is_liked),
   });

   useEffect(() => {
      if (artwork) {
         const item = itemFromArtwork(artwork);
         ecommerceAnalytics.viewItem(
            artwork.currency?.code || "MMK",
            Number(artwork.price) || 0,
            [item],
            source
         );
      }
   }, [artwork, source]);

   if (artworkQuery.isLoading || authLoading) {
      return <ArtworkDetailPageSkeleton />;
   }

   if (artworkQuery.isError || !artwork) {
      return notFound();
   }

   const artistDisplayName =
      artwork.artist_name ||
      (artwork.artist_profile ? getUserDisplayName(artwork.artist_profile) : null);

   return (
      <section aria-labelledby="artwork-title" className="pb-12">
         {/* Navigation & Header */}
         <div className="mb-5 space-y-2">
            <Button
               variant="ghost"
               size="sm"
               className="flex items-center gap-1.5 pl-0 hover:bg-transparent text-muted-foreground hover:text-foreground cursor-pointer -ml-1 transition-colors"
               onClick={goBack}
            >
               <ArrowLeft className="w-4 h-4" />
               {t("backToArtworks")}
            </Button>

            <div className="space-y-1">
               {artwork.artist_profile?.id ? (
                  <Link
                     to={paths.artists.detail.getHref(String(artwork.artist_profile.id))}
                     className="inline-block text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground hover:text-primary transition-colors uppercase"
                  >
                     {artistDisplayName}
                  </Link>
               ) : artistDisplayName ? (
                  <p className="text-xs sm:text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                     {artistDisplayName}
                  </p>
               ) : null}

               <h1
                  id="artwork-title"
                  className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-display tracking-tight text-foreground"
               >
                  {artwork.title}
                  {artwork.year ? (
                     <span className="text-muted-foreground font-normal text-xl sm:text-2xl ml-2.5">
                        ({artwork.year})
                     </span>
                  ) : null}
               </h1>
            </div>
         </div>

         {/* Main Grid: Gallery Presentation (Left) + Buy Box (Right) */}
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Left Column: Artwork Hero + Specs */}
            <section className="lg:col-span-2 space-y-6" aria-label="Artwork details">
               {/* Hero Image Container with Actions */}
               <div className="relative group">
                  <ArtworkImage artwork={artwork} />

                  {/* Overlaid Actions (Like & Share/Report) */}
                  <div className="absolute top-3 right-3 flex items-center gap-2 z-10">
                     <button
                        type="button"
                        onClick={handleLike}
                        className="bg-background/85 hover:bg-background text-foreground/80 hover:text-red-500 backdrop-blur-md border border-border/70 shadow-xs rounded-full p-2.5 cursor-pointer transition-all duration-200"
                        title={isLiked ? t("liked") : t("like")}
                        aria-label={isLiked ? t("liked") : t("like")}
                     >
                        <Heart
                           className={cn(
                              "w-4 h-4 transition-colors",
                              isLiked ? "fill-red-500 text-red-500" : ""
                           )}
                        />
                     </button>
                     <ArtworkDetailMore artwork={artwork} />
                  </div>
               </div>

               {/* Mobile Buy Box: Appears right after image for instant mobile conversion */}
               <div className="block lg:hidden">
                  <ProductInfoCard artwork={artwork} />
               </div>

               {/* Description */}
               <section aria-labelledby="artwork-description" className="space-y-2">
                  <h2
                     id="artwork-description"
                     className="font-semibold text-lg md:text-xl font-display text-foreground"
                  >
                     {t("description")}
                  </h2>
                  <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">
                     {artwork.description || t("noDescription")}
                  </p>
               </section>

               {/* Characteristics Table */}
               <ArtworkCharacteristicsCard
                  year={artwork.year}
                  styles={artwork.artwork_styles}
                  dimensions={artwork.dimensions || "N/A"}
                  medium={artwork.medium || "N/A"}
                  category={artwork.category}
                  categoryName={artwork.category_name}
                  artistName={artistDisplayName || undefined}
                  artistId={artwork.artist_profile?.id}
                  currentOwner={
                     artwork.current_owner_name
                        ? artwork.current_owner_name
                        : artwork.current_owner_display
                        ? getUserDisplayName(artwork.current_owner_display)
                        : undefined
                  }
               />

               {/* Search Keywords (Clickable tag chips) */}
               {artwork.search_keywords && artwork.search_keywords.length > 0 && (
                  <div className="space-y-2.5">
                     <h2 className="font-semibold text-lg md:text-xl font-display text-foreground">
                        {t("keywords")}
                     </h2>
                     <div className="flex flex-wrap gap-2" aria-label="Artwork keywords">
                        {artwork.search_keywords.map((kw) => (
                           <Link
                              key={kw}
                              to={`${paths.artworks.path}?search=${encodeURIComponent(kw)}`}
                              className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium border border-border/80 bg-background hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer shadow-2xs"
                           >
                              #{kw}
                           </Link>
                        ))}
                     </div>
                  </div>
               )}

               {/* Artist Profile Section */}
               {artwork.artist_profile && (
                  <ArtistProfile artist={artwork.artist_profile} />
               )}
            </section>

            {/* Right Column: Desktop Sticky Buy Box */}
            <aside
               className="hidden lg:block lg:col-span-1 space-y-6 sticky top-20 self-start"
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
