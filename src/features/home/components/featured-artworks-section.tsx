'use client'
import ArtworkCard from "@/components/app/artwork-card";
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { getArtworks } from "@/features/service/artspace/get-artworks";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedArtworksSectionSkeleton } from "./featured-artworks-section-skeleton";
import { useTranslations } from "next-intl";

export const FeaturedArtworksSection = () => {
   const t = useTranslations("Home");
   const artworksQuery = useQuery({
      queryKey: queryKeys.artwork.list({ limit: 10 }),
      queryFn: () => getArtworks({ limit: 10 }),
      staleTime: 1000 * 60 * 5, // 5 minutes
   })

   const featuredArtworks = artworksQuery.data?.results ?? [];

   if (artworksQuery.isLoading) {
      return <FeaturedArtworksSectionSkeleton />;
   }

   return (
      <section className="space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <SectionTitle>{t("featuredArtworks")}</SectionTitle>
               <p className="text-sm text-muted-foreground mt-1">{t("featuredArtworksSubtitle")}</p>
            </div>
            <div className="flex gap-2">
               <Link to={paths.artworks.path}>
                  <Button variant="link" className="hidden md:flex text-primary">
                     {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
               <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full swiper-artwork-prev">
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full swiper-artwork-next">
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </div>

         <div className="-mx-4 md:mx-0 overflow-hidden">
            <Swiper
               modules={[Navigation]}
               slidesPerView={2.2}
               slidesPerGroup={1}
               spaceBetween={12}
               watchSlidesProgress
               touchStartPreventDefault={false}
               navigation={{
                  nextEl: ".swiper-artwork-next",
                  prevEl: ".swiper-artwork-prev",
               }}
               className="!px-4 md:!px-0 !overflow-visible"
               breakpoints={{
                  640: { slidesPerView: 3.2, spaceBetween: 16 },
                  1024: { slidesPerView: 4.2, spaceBetween: 20 },
                  1280: { slidesPerView: 5.2, spaceBetween: 24 },
               }}
            >
               {featuredArtworks.map((artwork) => (
                  <SwiperSlide key={artwork.id}>
                     <ArtworkCard artwork={artwork} className="h-full" />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>

         <div className="md:hidden px-4">
            <Link to={paths.artworks.path}>
               <Button variant="outline" className="w-full">
                  Explore All Artworks
               </Button>
            </Link>
         </div>
      </section>
   );
};
