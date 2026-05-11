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
      <div className="group overflow-hidden h-full rounded-sm w-full transition-all duration-300">
         {/* Cover */}
         <Link to={paths.events.detail.getHref(event.slug)}>
            <div className="relative h-40 md:h-48 w-full overflow-hidden">
               <AppImage
                  src={getImage(event.cover_photo)}
                  alt={event.title}
                  fill
                  sizes={sizes || "100vw"}
                  className="object-cover transition-transform duration-500"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity" />

               {/* Event Type Badge */}
               <div className="absolute top-3 left-3">
                  <Badge className="bg-white/90 text-black border-none text-[10px] font-black px-2 py-0.5 rounded-sm shadow-sm">
                     {event.event_type}
                  </Badge>
               </div>

               {startDate && endDate && (
                  <div className="absolute bottom-3 left-3 right-3 flex justify-between items-end">
                     <div className="text-white">
                        <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider">Date</p>
                        <p className="text-xs font-bold bg-black/60 px-2 py-1 rounded-sm border border-white/10">
                           {startDate} - {endDate}
                        </p>
                     </div>
                  </div>
               )}
            </div>
         </Link>

         {/* Info */}
         <div className="pt-3 flex flex-col gap-1.5">
            <Link to={paths.events.detail.getHref(event.slug)}>
               <h3 className="text-lg font-bold font-display tracking-tight group-hover:text-primary transition-colors line-clamp-1">
                  {event.title}
               </h3>
            </Link>

            {event.artists.length > 0 && (
               <div className="flex flex-col gap-1">
                  <p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold">Artists</p>
                  <p className="text-sm text-foreground/80 truncate">
                     {event.artists
                        .slice(0, 3)
                        .map((a) => `${a.first_name} ${a.last_name}`)
                        .join(", ")}
                     {event.artists.length > 3
                        ? ` +${event.artists.length - 3}`
                        : ""}
                  </p>
               </div>
            )}
         </div>
      </div>
   );
};
