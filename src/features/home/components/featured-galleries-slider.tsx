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

export const FeaturedGalleriesSlider = () => {
   const t = useTranslations("Home");
   const galleriesQuery = useQuery({
      queryKey: queryKeys.gallery.list({ limit: 10 }),
      queryFn: () => getGalleries({ limit: 10 }),
      staleTime: 1000 * 60 * 5, // 5 minutes
   })

   const featuredGalleries = galleriesQuery.data?.results ?? [];

   if (galleriesQuery.isLoading) {
      return <FeaturedGalleriesSectionSkeleton />;
   }

   if (featuredGalleries.length === 0) {
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
               <SectionTitle>{t("galleries")}</SectionTitle>
               <p className="text-sm text-muted-foreground mt-1">{t("featuredGalleriesSubtitle")}</p>
            </div>
            <div className="flex gap-2">
               <Link to={paths.galleries.path}>
                  <Button variant="link" className="hidden md:flex text-primary">
                     {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
               <div className="flex gap-1">
                  <Button
                     variant="outline"
                     size="icon"
                     aria-label={t("previousSlide")}
                     className="h-8 w-8 rounded-full swiper-gallery-button-prev-custom"
                  >
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                     variant="outline"
                     size="icon"
                     aria-label={t("nextSlide")}
                     className="h-8 w-8 rounded-full swiper-gallery-button-next-custom"
                  >
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </motion.div>
         
         <motion.div variants={contentVariants}>
            <div className="-mx-4 md:mx-0 overflow-hidden">
               <Swiper
                  modules={[Navigation]}
                  slidesPerView="auto"
                  slidesPerGroup={1}
                  spaceBetween={8}
                  watchSlidesProgress
                  touchStartPreventDefault={false}
                  navigation={{
                     nextEl: ".swiper-gallery-button-next-custom",
                     prevEl: ".swiper-gallery-button-prev-custom",
                  }}
                  className="!px-4 md:!px-0 !overflow-visible"
               >
                  {featuredGalleries.map((gallery) => (
                     <SwiperSlide key={gallery.id} className="!w-auto">
                        <motion.div variants={cardVariants}>
                           <UserSmallCard user={gallery} />
                        </motion.div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>

            <div className="md:hidden px-4 mt-4">
               <Link to={paths.galleries.path}>
                  <Button variant="outline" className="w-full">
                     {t("viewAll")}
                  </Button>
               </Link>
            </div>
         </motion.div>
      </motion.section>
   );
};
