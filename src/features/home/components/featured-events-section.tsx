'use client'
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { EventWideCard } from "@/features/events/components/event-wide-card";
import { getEvents } from "@/features/service/artspace/get-events";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { FeaturedEventsSectionSkeleton } from "./featured-events-section-skeleton";
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

export const FeaturedEventsSection = () => {
   const t = useTranslations("Home");
   const eventsQuery = useQuery({
      queryKey: queryKeys.event.list({ limit: 6 }), // Increased limit for better slider experience
      queryFn: () => getEvents({ limit: 6 }),
      staleTime: 1000 * 60 * 5, // 5 minutes
   })

   const featuredEvents = eventsQuery.data?.results ?? [];

   if (eventsQuery.isLoading) {
      return <FeaturedEventsSectionSkeleton />;
   }

   if (featuredEvents.length === 0) {
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
               <SectionTitle>{t("featuredEvents")}</SectionTitle>
               <p className="text-sm text-muted-foreground mt-1">{t("featuredEventsSubtitle")}</p>
            </div>
            <div className="flex gap-2">
               <Link to={paths.events.path}>
                  <Button variant="link" className="hidden md:flex text-primary">
                     {t("viewAll")} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
               </Link>
               <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full swiper-event-prev">
                     <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full swiper-event-next">
                     <ChevronRight className="h-4 w-4" />
                  </Button>
               </div>
            </div>
         </motion.div>

         <motion.div variants={contentVariants}>
            <div className="-mx-4 md:mx-0 overflow-hidden">
               <Swiper
                  modules={[Navigation]}
                  slidesPerView={1.2}
                  slidesPerGroup={1}
                  spaceBetween={12}
                  watchSlidesProgress
                  touchStartPreventDefault={false}
                  navigation={{
                     prevEl: ".swiper-event-prev",
                     nextEl: ".swiper-event-next",
                  }}
                  breakpoints={{
                     640: { slidesPerView: 2.2, spaceBetween: 16 },
                     // md matches tablet
                     1024: { slidesPerView: 2.8, spaceBetween: 20 },
                     1280: { slidesPerView: 3.5, spaceBetween: 24 },
                  }}
                  className="!px-4 md:!px-0 !overflow-visible"
               >
                  {featuredEvents.map((event) => (
                     <SwiperSlide key={event.id}>
                        <motion.div variants={cardVariants}>
                           <EventWideCard event={event} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" />
                        </motion.div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>

            <div className="md:hidden px-4 mt-4">
               <Link to={paths.events.path}>
                  <Button variant="outline" className="w-full">
                     View All Events
                  </Button>
               </Link>
            </div>
         </motion.div>
      </motion.section>
   );
};
