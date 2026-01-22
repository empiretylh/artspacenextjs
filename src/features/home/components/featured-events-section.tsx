'use client'
import { SectionTitle } from "@/components/common";
import { Button } from "@/components/ui/button";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import { ArrowRight } from "lucide-react";
import { FeaturedCollectorsSectionSkeleton } from "./featured-collectors-section-skeleton";
import { EventWideCard } from "@/features/events/components/event-wide-card";
import { useGetEvents } from "@/features/service/artspace/get-events";

export const FeaturedEventsSection = () => {
   const eventsQuery = useGetEvents({
      limit: 3,
   });

   const featuredEvents = eventsQuery.data?.data?.results ?? [];

   if (eventsQuery.isLoading) {
      return <FeaturedCollectorsSectionSkeleton />;
   }

   if (featuredEvents.length === 0) {
      return null;
   }

   return (
      <section>
         <div className="flex justify-between items-end mb-4">
            <div>
               <SectionTitle>Events</SectionTitle>
            </div>
            <Link to={paths.events.path}>
               <Button variant="ghost" className="flex">
                  View All <ArrowRight className="ml-2 h-4 w-4" />
               </Button>
            </Link>
         </div>
         <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-2">
            {featuredEvents.map((event) => (
               <div className="shrink-0" key={event.id}>
                  <EventWideCard event={event} key={event.id} />
               </div>
            ))}
         </div>
      </section>
   );
};
