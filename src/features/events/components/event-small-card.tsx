import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { Badge } from "@/components/ui/badge";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import type { Event } from "@/types";
import { format } from "date-fns";

interface EventSmallCardProps {
   event: Event;
   sizes?: string;
}

export const EventSmallCard: React.FC<EventSmallCardProps> = ({ event, sizes }) => {
   const startDate = event.start_date
      ? format(new Date(event.start_date), "MMM dd")
      : null;
   const endDate = event.end_date
      ? format(new Date(event.end_date), "MMM dd, yyyy")
      : null;

   return (
      <div className="overflow-hidden w-full border h-full rounded-md">
         <Link to={paths.events.detail.getHref(event.slug)}>
            <div className="relative aspect-video w-full">
               <AppImage
                  src={getImage(event.cover_photo)}
                  alt={event.title}
                  width={1600}
                  height={900}
                  sizes={sizes || "100vw"}
                  className="h-full w-full object-cover"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            </div>
         </Link>

         <div className="p-3 flex flex-col gap-1">
            <Link to={paths.events.detail.getHref(event.slug)}>
               <h3 className="text-lg font-bold font-display tracking-tight truncate hover:text-primary transition-colors">{event.title}</h3>
            </Link>

            <div className="flex items-center gap-2 flex-wrap">
               <Badge>{event.event_type}</Badge>
               {startDate && endDate && (
                  <span className="text-sm text-muted-foreground">
                     {startDate} - {endDate}
                  </span>
               )}
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
