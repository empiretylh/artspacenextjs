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

   return (
      <motion.section
         variants={sectionVariants}
         initial="hidden"
         whileInView="show"
         viewport={{ once: true, margin: "-100px" }}
      >
         <motion.div variants={titleVariants} className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>{t("galleries")}</SectionTitle>
            </div>
            <Link to={paths.galleries.path}>
               <Button variant="ghost" className="flex">
                  {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </motion.div>
         
         <motion.div variants={contentVariants}>
            <div className="flex gap-2 mb-4">
               <Button
                  variant="outline"
                  className="swiper-gallery-button-prev-custom"
               >
                  <ChevronLeft />
               </Button>
               <Button
                  variant="outline"
                  className="swiper-gallery-button-next-custom"
               >
                  <ChevronRight />
               </Button>
            </div>

            <div className="overflow-hidden">
               <Swiper
                  modules={[Navigation]}
                  slidesPerView="auto"
                  spaceBetween={8}
                  watchSlidesProgress
                  touchStartPreventDefault={false}
                  navigation={{
                     nextEl: ".swiper-gallery-button-next-custom",
                     prevEl: ".swiper-gallery-button-prev-custom",
                  }}
                  className="!overflow-visible"
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
         </motion.div>
      </motion.section>
   );
};
