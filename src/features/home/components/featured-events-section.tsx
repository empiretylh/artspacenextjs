'use client'
import { SectionTitle } from "@/components/common";
import Link from "@/components/common/link";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { queryKeys } from "@/config/query-keys";
import { EventWideCard } from "@/features/events/components/event-wide-card";
import { getEvents } from "@/features/service/artspace/get-events";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { FeaturedCollectorsSectionSkeleton } from "./featured-collectors-section-skeleton";

export const FeaturedEventsSection = () => {
   const eventsQuery = useQuery({
      queryKey: queryKeys.event.list({ limit: 3 }),
      queryFn: () => getEvents({ limit: 3 }),
   })

   const featuredEvents = eventsQuery.data?.results ?? [];

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
                  <EventWideCard event={event} key={event.id} sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 600px" />
               </div>
            ))}
         </div>
      </section>
   );
};
