'use client'
import ProfileCard from "@/components/app/profile/profile-card";
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { getArtists } from "@/features/service/artspace/get-artists";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { FeaturedArtistsSectionSkeleton } from "./featured-artists-section-skeleton";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

const sectionVariants = {
   hidden: {},
   show: {
      transition: {
         staggerChildren: 0.15,
      },
   },
} as const;

const titleVariants = {
   hidden: { opacity: 0, y: 15 },
   show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
} as const;

const contentVariants = {
   hidden: {},
   show: {
      transition: {
         staggerChildren: 0.06,
         delayChildren: 0.1,
      },
   },
} as const;

const cardVariants = {
   hidden: { opacity: 0, y: 15 },
   show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
} as const;

export const FeaturedArtistsSlider = () => {
   const t = useTranslations("Home");
   const artistsQuery = useQuery({
      queryKey: queryKeys.artist.list({ limit: 10 }),
      queryFn: () => getArtists({ limit: 10 }),
      refetchOnMount: "always",
   });

   const featuredArtists = artistsQuery.data?.results ?? [];

   if (artistsQuery.isLoading) {
      return <FeaturedArtistsSectionSkeleton />;
   }

   if (featuredArtists.length === 0) {
      return null;
   }

   return (
      <motion.section
         variants={sectionVariants}
         initial="hidden"
         whileInView="show"
         viewport={{ once: true, margin: "-100px" }}
         className="space-y-6"
      >
         <motion.div variants={titleVariants} className="flex justify-between items-center">
            <div>
               <SectionTitle>{t("artists")}</SectionTitle>
               <p className="text-sm text-muted-foreground mt-1">{t("featuredArtistsSubtitle")}</p>
            </div>
            <div className="flex gap-2">
               <Link to={paths.artists.path}>
                  <Button variant="link" className="hidden md:flex text-primary">
                     {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
               <div className="flex gap-1">
                  <Button
                     variant="outline"
                     size="icon"
                     aria-label={t("previousSlide")}
                     className="h-8 w-8 rounded-full swiper-artist-button-prev-custom"
                  >
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                     variant="outline"
                     size="icon"
                     aria-label={t("nextSlide")}
                     className="h-8 w-8 rounded-full swiper-artist-button-next-custom"
                  >
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </motion.div>
         
         <motion.div variants={contentVariants}>
            <div className="overflow-hidden">
               <Swiper
                  modules={[Navigation]}
                  slidesPerView={3}
                  slidesPerGroup={1}
                  spaceBetween={8}
                  watchSlidesProgress
                  touchStartPreventDefault={false}
                  breakpoints={{
                     640: {
                        slidesPerView: 3,
                        spaceBetween: 8,
                     },
                     768: {
                        slidesPerView: 3,
                        spaceBetween: 8,
                     },
                     1024: {
                        slidesPerView: 4,
                        spaceBetween: 8,
                     },
                     1280: {
                        slidesPerView: 5,
                        spaceBetween: 8,
                     },
                     1440: {
                        slidesPerView: 6,
                        spaceBetween: 8,
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
                        <motion.div variants={cardVariants}>
                           <ProfileCard user={artist} />
                        </motion.div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>

            <div className="md:hidden px-4 mt-4">
               <Link to={paths.artists.path}>
                  <Button variant="outline" className="w-full">
                     {t("viewAll")}
                  </Button>
               </Link>
            </div>
         </motion.div>
      </motion.section>
   );
};
