import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Badge } from "@/components/ui/badge";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import type { Event } from "@/types";
import { formatInTimeZone } from "date-fns-tz";

interface EventWideCardProps {
   event: Event;
   sizes?: string;
}

export const EventWideCard: React.FC<EventWideCardProps> = ({ event, sizes }) => {
   const startDate = event.start_date
      ? formatInTimeZone(event.start_date, env.TZ, "MMM dd")
      : null;
   const endDate = event.end_date
      ? formatInTimeZone(event.end_date, env.TZ, "MMM dd, yyyy")
      : null;

   return (
      <div className="overflow-hidden border h-full rounded-lg w-full">
         {/* Cover */}
         <Link to={paths.events.detail.getHref(event.slug)}>
            <div className="relative h-48 w-full">
               <AppImage
                  src={getImage(event.cover_photo)}
                  alt={event.title}
                  fill // Required for absolute positioning in the h-48 container
                  // If mobile: full width. If desktop: likely part of a 2 or 3 column grid.
                  sizes={sizes || "100vw"}
                  className="object-cover"
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
