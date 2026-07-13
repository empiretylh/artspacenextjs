'use client'
import UserSmallCard from "@/components/app/user-small-card";
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { getCollectors } from "@/features/service/artspace/get-collectors";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedCollectorsSectionSkeleton } from "./featured-collectors-section-skeleton";
import { useTranslations } from "next-intl";

export const FeaturedCollectorsSlider = () => {
   const t = useTranslations("Home");
   const collectorsQuery = useQuery({
      queryKey: queryKeys.collector.list({ limit: 10 }),
      queryFn: () => getCollectors({ limit: 10 }),
      staleTime: 1000 * 60 * 5, // 5 minutes
   });

   const featuredCollectors = collectorsQuery.data?.results ?? [];

   if (collectorsQuery.isLoading) {
      return <FeaturedCollectorsSectionSkeleton />;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>{t("collectors")}</SectionTitle>
            </div>
            <Link to={paths.collectors.path}>
               <Button variant="ghost" className="flex">
                  {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="flex gap-2 mb-4">
            <Button
               variant="outline"
               className="swiper-collector-button-prev-custom"
            // onClick={() => swiperRef.current?.slideNext()}
            >
               <ChevronLeft />
            </Button>
            <Button
               variant="outline"
               className="swiper-collector-button-next-custom"
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
               {featuredCollectors.map((collector) => (
                  <CarouselItem
                     key={collector.id}
                     className="pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                     <div
                        onClick={() =>
                           router.push(paths.collectors.detail.getHref(collector.id))
                        }
                        className="cursor-pointer border transition-transform duration-300 overflow-hidden"
                     >
                        <img
                           src={getImage(collector.image)}
                           alt={collector.title}
                           className="min-w-[115px] h-[240px] mx-auto"
                        />
                        <div className="space-y-1 p-2">
                           <div className="flex justify-between items-start">
                              <h3 className="font-semibold truncate">
                                 {collector.title}
                              </h3>
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                 {collector.category_name}
                              </span>
                           </div>
                           <p className="text-sm text-muted-foreground">
                              by {collector.artist_name}
                           </p>
                           <div className="flex justify-between items-center pt-2">
                              <span className="font-bold text-foreground">
                                 ${collector.price.toLocaleString()}
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
               watchSlidesProgress
               touchStartPreventDefault={false}
               navigation={{
                  nextEl: ".swiper-collector-button-next-custom",
                  prevEl: ".swiper-collector-button-prev-custom",
               }}
               className="!overflow-visible"
            >
               {featuredCollectors.map((collector) => (
                  <SwiperSlide key={collector.id} className="!w-auto">
                     <UserSmallCard user={collector} />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </section>
   );
};
