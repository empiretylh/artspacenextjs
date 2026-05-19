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

export const FeaturedEventsSection = () => {
   const eventsQuery = useQuery({
      queryKey: queryKeys.event.list({ limit: 6 }), // Increased limit for better slider experience
      queryFn: () => getEvents({ limit: 6 }),
   })

   const featuredEvents = eventsQuery.data?.results ?? [];

   if (eventsQuery.isLoading) {
      return <FeaturedEventsSectionSkeleton />;
   }

   if (featuredEvents.length === 0) {
      return null;
   }

   return (
      <section className="space-y-6">
         <div className="flex justify-between items-center">
            <div>
               <SectionTitle>Featured Events</SectionTitle>
               <p className="text-sm text-muted-foreground mt-1">Discover latest art exhibitions and events</p>
            </div>
            <div className="flex gap-2">
               <Link to={paths.events.path}>
                  <Button variant="link" className="hidden md:flex text-primary">
                     View All <ArrowRight className="ml-2 h-4 w-4" />
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
         </div>

         <div className="-mx-4 md:mx-0 overflow-hidden">
            <Swiper
               modules={[Navigation]}
               slidesPerView={1.2}
               slidesPerGroup={1}
               spaceBetween={12}
               navigation={{
                  prevEl: ".swiper-event-prev",
                  nextEl: ".swiper-event-next",
               }}
               watchSlidesProgress={true}
               breakpoints={{
                  640: { slidesPerView: 2.2, spaceBetween: 16 },
                  1024: { slidesPerView: 2.8, spaceBetween: 20 },
                  1280: { slidesPerView: 3.5, spaceBetween: 24 },
               }}
               className="!px-4 md:!px-0 !overflow-visible"
            >
               {featuredEvents.map((event) => (
                  <SwiperSlide key={event.id}>
                     <EventWideCard event={event} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px" />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>

         <div className="md:hidden px-4">
            <Link to={paths.events.path}>
               <Button variant="outline" className="w-full">
                  View All Events
               </Button>
            </Link>
         </div>
      </section>
   );
};
