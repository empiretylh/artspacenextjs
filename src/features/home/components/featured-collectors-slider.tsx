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
      <motion.section
         variants={sectionVariants}
         initial="hidden"
         whileInView="show"
         viewport={{ once: true, margin: "-100px" }}
      >
         <motion.div variants={titleVariants} className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>{t("collectors")}</SectionTitle>
            </div>
            <Link to={paths.collectors.path}>
               <Button variant="ghost" className="flex">
                  {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </motion.div>
         
         <motion.div variants={contentVariants}>
            <div className="flex gap-2 mb-4">
               <Button
                  variant="outline"
                  className="swiper-collector-button-prev-custom"
               >
                  <ChevronLeft />
               </Button>
               <Button
                  variant="outline"
                  className="swiper-collector-button-next-custom"
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
                     nextEl: ".swiper-collector-button-next-custom",
                     prevEl: ".swiper-collector-button-prev-custom",
                  }}
                  className="!overflow-visible"
               >
                  {featuredCollectors.map((collector) => (
                     <SwiperSlide key={collector.id} className="!w-auto">
                        <motion.div variants={cardVariants}>
                           <UserSmallCard user={collector} />
                        </motion.div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>
         </motion.div>
      </motion.section>
   );
};
