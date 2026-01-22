import Image from "@/components/common/image";
import Link from "@/components/common/link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { paths } from "@/config/paths";
import { getImage } from "@/lib/utils";
import type { Event } from "@/types";

interface EventCardProps {
   event: Event;
   typeColorMap: Record<string, string>;
}

export const EventCard: React.FC<EventCardProps> = ({
   event,
   typeColorMap,
}) => {
   return (
      <Card key={event.id} className="overflow-hidden w-full !pt-0">
         {/* Cover */}
         <div className="relative h-[260px] w-full">
            <Image
               src={getImage(event.cover_photo)}
               alt={event.title}
               className="h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-4">
               <div className="flex items-center gap-4">
                  {/* <Image
                     src={getImage(event.artists[0]?.profile?.profile_picture)}
                     alt="logo"
                     className="h-14 w-14 rounded-md bg-white object-contain p-1"
                  /> */}
                  <div>
                     <Link to={paths.events.detail.getHref(event.slug)}>
                        <h2 className="text-xl font-semibold text-white">
                           {event.title}
                        </h2>
                     </Link>
                     <Badge className={typeColorMap[event.event_type]}>
                        {event.event_type}
                     </Badge>
                  </div>
               </div>

               {/* {event.link && (
                  <Button asChild variant="secondary" size="sm">
                     <a href={event.link} target="_blank" rel="noreferrer">
                        Visit <ExternalLink className="ml-2 h-4 w-4" />
                     </a>
                  </Button>
               )} */}
            </div>
         </div>

         <CardContent className="space-y-6">
            {/* About */}
            <div>
               <h3 className="mb-1 text-sm font-medium text-muted-foreground">
                  About
               </h3>
               <p className="text-sm leading-relaxed">{event.about}</p>
            </div>

            {/* Artists */}
            <div>
               <h3 className="mb-2 text-sm font-medium text-muted-foreground">
                  Artists
               </h3>
               <div className="flex flex-wrap gap-2">
                  {event.artists.map((artist) => (
                     <Badge key={artist.id} variant="outline">
                        {artist.first_name} {artist.last_name}
                     </Badge>
                  ))}
               </div>
            </div>

            {/* Artworks */}
            <div>
               <h3 className="mb-3 text-sm font-medium text-muted-foreground">
                  Artworks
               </h3>
               <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {event.artworks.map((art) => (
                     <div
                        key={art.id}
                        className="aspect-square overflow-hidden rounded-md border"
                     >
                        <Image
                           src={getImage(art.image)}
                           alt={art.title}
                           className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                     </div>
                  ))}
               </div>
            </div>
         </CardContent>
      </Card>
   );
};
