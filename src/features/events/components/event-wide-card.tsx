import { format } from "date-fns";
import Image from "@/components/common/image";
import Link from "@/components/common/link";
import { Badge } from "@/components/ui/badge";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import type { Event } from "@/types";

interface EventWideCardProps {
   event: Event;
}

export const EventWideCard: React.FC<EventWideCardProps> = ({ event }) => {
   const startDate = event.start_date
      ? format(new Date(event.start_date), "MMM dd")
      : null;
   const endDate = event.end_date
      ? format(new Date(event.end_date), "MMM dd, yyyy")
      : null;

   return (
      <div className="overflow-hidden border h-full rounded-lg w-full">
         {/* Cover */}
         <Link to={paths.events.detail.getHref(event.slug)}>
            <div className="relative h-48 w-full">
               <Image
                  src={getImage(event.cover_photo)}
                  alt={event.title}
                  className="h-full w-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
               {startDate && endDate && (
                  <div className="absolute bottom-2 left-2 text-white text-sm font-medium bg-black/30 px-2 py-1 rounded">
                     {startDate} - {endDate}
                  </div>
               )}
            </div>
         </Link>

         {/* Info */}
         <div className="p-4 flex flex-col gap-2">
            <Link to={paths.events.detail.getHref(event.slug)}>
               <h3 className="text-lg font-semibold truncate hover:underline">
                  {event.title}
               </h3>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
               <Badge className="">{event.event_type}</Badge>
            </div>

            {event.artists.length > 0 && (
               <p className="text-sm text-muted-foreground truncate">
                  {event.artists
                     .slice(0, 2)
                     .map((a) => `${a.first_name} ${a.last_name}`)
                     .join(", ")}
                  {event.artists.length > 2
                     ? ` +${event.artists.length - 2}`
                     : ""}
               </p>
            )}
         </div>
      </div>
   );
};
