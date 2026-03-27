'use client'
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedGalleriesSectionSkeleton } from "./featured-galleries-section-skeleton";
import { getGalleries } from "@/features/service/artspace/get-galleries";
import UserSmallCard from "@/components/app/user-small-card";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";

export const FeaturedGalleriesSlider = () => {
   const galleriesQuery = useQuery({
      queryKey: queryKeys.gallery.list({ limit: 10 }),
      queryFn: () => getGalleries({ limit: 10 }),
   })

   const featuredGalleries = galleriesQuery.data?.results ?? [];

   if (galleriesQuery.isLoading) {
      return <FeaturedGalleriesSectionSkeleton />;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Galleries</SectionTitle>
            </div>
            <Link to={paths.galleries.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="flex gap-2 mb-4">
            <Button
               variant="outline"
               className="swiper-gallery-button-prev-custom"
            // onClick={() => swiperRef.current?.slideNext()}
            >
               <ChevronLeft />
            </Button>
            <Button
               variant="outline"
               className="swiper-gallery-button-next-custom"
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
               {featuredGalleries.map((gallery) => (
                  <CarouselItem
                     key={gallery.id}
                     className="pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                     <div
                        onClick={() =>
                           router.push(paths.galleries.detail.getHref(gallery.id))
                        }
                        className="cursor-pointer border transition-transform duration-300 overflow-hidden"
                     >
                        <img
                           src={getImage(gallery.image)}
                           alt={gallery.title}
                           className="min-w-[115px] h-[240px] mx-auto"
                        />
                        <div className="space-y-1 p-2">
                           <div className="flex justify-between items-start">
                              <h3 className="font-semibold truncate">
                                 {gallery.title}
                              </h3>
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                 {gallery.category_name}
                              </span>
                           </div>
                           <p className="text-sm text-muted-foreground">
                              by {gallery.artist_name}
                           </p>
                           <div className="flex justify-between items-center pt-2">
                              <span className="font-bold text-foreground">
                                 ${gallery.price.toLocaleString()}
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
               spaceBetween={8}
               // onInit={(swiper) => {
               //    swiperRef.current = swiper;
               // }}
               navigation={{
                  nextEl: ".swiper-gallery-button-next-custom",
                  prevEl: ".swiper-gallery-button-prev-custom",
               }}
               className="!overflow-visible"
            >
               {featuredGalleries.map((gallery) => (
                  <SwiperSlide key={gallery.id} className="!w-auto">
                     <UserSmallCard user={gallery} />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </section>
   );
};
