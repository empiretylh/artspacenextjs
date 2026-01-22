'use client'
import ArtworkCard from "@/components/app/artwork-card";
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedArtworksSectionSkeleton } from "./featured-artworks-section-skeleton";
import { useGetArtworks } from "@/features/service/artspace/get-artworks";

export const FeaturedArtworksSection = () => {
   const artworksQuery = useGetArtworks({ limit: 10 });
   const featuredArtworks = artworksQuery.data?.data.results ?? [];

   if (artworksQuery.isLoading) {
      return <FeaturedArtworksSectionSkeleton />;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Artworks</SectionTitle>
            </div>
            <Link to={paths.artworks.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="flex gap-2 mb-4">
            <Button
               variant="outline"
               className="swiper-button-prev-custom"
            // onClick={() => swiperRef.current?.slideNext()}
            >
               <ChevronLeft />
            </Button>
            <Button
               variant="outline"
               className="swiper-button-next-custom"
            // onClick={() => swiperRef.current?.slideNext()}
            >
               <ChevronRight />
            </Button>
         </div>

         {/* Horizontal Scroll Area */}
         {/* <Carousel
            opts={{
               align: "start",
            }}
            className="w-full"
         >
            <CarouselContent className="-ml-4 justify-between">
               {featuredArtworks.map((artwork) => (
                  <CarouselItem
                     key={artwork.id}
                     className="pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                     <div
                        onClick={() =>
                           router.push(paths.artworks.detail.getHref(artwork.id))
                        }
                        className="cursor-pointer border transition-transform duration-300 overflow-hidden"
                     >
                        <img
                           src={getImage(artwork.image)}
                           alt={artwork.title}
                           className="min-w-[115px] h-[240px] mx-auto"
                        />
                        <div className="space-y-1 p-2">
                           <div className="flex justify-between items-start">
                              <h3 className="font-semibold truncate">
                                 {artwork.title}
                              </h3>
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                 {artwork.category_name}
                              </span>
                           </div>
                           <p className="text-sm text-muted-foreground">
                              by {artwork.artist_name}
                           </p>
                           <div className="flex justify-between items-center pt-2">
                              <span className="font-bold text-foreground">
                                 ${artwork.price.toLocaleString()}
                              </span>
                           </div>
                        </div>
                     </div>
                  </CarouselItem>
               ))}
            </CarouselContent>

            <div className="flex justify-center gap-3 pt-4">
               <CarouselPrevious className="relative static translate-y-0" />
               <CarouselNext className="relative static translate-y-0" />
            </div>
         </Carousel> */}

         <div className="overflow-hidden">
            <Swiper
               modules={[Navigation]}
               slidesPerView="auto"
               spaceBetween={16}
               // onInit={(swiper) => {
               //    swiperRef.current = swiper;
               // }}
               navigation={{
                  nextEl: ".swiper-button-next-custom",
                  prevEl: ".swiper-button-prev-custom",
               }}
               className="!overflow-visible"
            >
               {featuredArtworks.map((artwork) => (
                  <SwiperSlide key={artwork.id} className="!w-auto">
                     <ArtworkCard artwork={artwork} />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </section>
   );
};
