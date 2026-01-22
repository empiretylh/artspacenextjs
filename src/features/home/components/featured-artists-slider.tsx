'use client'
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedArtistsSectionSkeleton } from "./featured-artists-section-skeleton";
import { useGetArtists } from "@/features/service/artspace/get-artists";
import UserSmallCard from "@/components/app/user-small-card";
import ProfileCard from "@/components/app/profile/profile-card";
import { useIsMobile } from "@/hooks/use-mobile";

export const FeaturedArtistsSlider = () => {
   const artistsQuery = useGetArtists({ limit: 10 });
   const featuredArtists = artistsQuery.data?.data.results ?? [];

   const isMobile = useIsMobile();

   if (artistsQuery.isLoading) {
      return <FeaturedArtistsSectionSkeleton />;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Artists</SectionTitle>
            </div>
            <Link to={paths.artists.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="flex gap-2 mb-4">
            <Button
               variant="outline"
               className="swiper-artist-button-prev-custom"
            // onClick={() => swiperRef.current?.slideNext()}
            >
               <ChevronLeft />
            </Button>
            <Button
               variant="outline"
               className="swiper-artist-button-next-custom"
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
               {featuredArtists.map((artist) => (
                  <CarouselItem
                     key={artist.id}
                     className="pl-4 md:basis-1/2 lg:basis-1/4"
                  >
                     <div
                        onClick={() =>
                           router.push(paths.artists.detail.getHref(artist.id))
                        }
                        className="cursor-pointer border transition-transform duration-300 overflow-hidden"
                     >
                        <img
                           src={getImage(artist.image)}
                           alt={artist.title}
                           className="min-w-[115px] h-[240px] mx-auto"
                        />
                        <div className="space-y-1 p-2">
                           <div className="flex justify-between items-start">
                              <h3 className="font-semibold truncate">
                                 {artist.title}
                              </h3>
                              <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full whitespace-nowrap">
                                 {artist.category_name}
                              </span>
                           </div>
                           <p className="text-sm text-muted-foreground">
                              by {artist.artist_name}
                           </p>
                           <div className="flex justify-between items-center pt-2">
                              <span className="font-bold text-foreground">
                                 ${artist.price.toLocaleString()}
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
               slidesPerView={3}
               spaceBetween={8}
               // onInit={(swiper) => {
               //    swiperRef.current = swiper;
               // }}
               breakpoints={{
                  640: {
                     slidesPerView: 3,
                  },
                  768: {
                     slidesPerView: 3,
                  },
                  1024: {
                     slidesPerView: 4,
                  },
                  1280: {
                     slidesPerView: 5,
                  },
                  1440: {
                     slidesPerView: 6,
                  },
               }}
               navigation={{
                  nextEl: ".swiper-artist-button-next-custom",
                  prevEl: ".swiper-artist-button-prev-custom",
               }}
               className="!overflow-visible"
            >
               {featuredArtists.map((artist) => (
                  <SwiperSlide key={artist.id} className="shrink-0">
                     <ProfileCard user={artist} />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>
      </section>
   );
};
