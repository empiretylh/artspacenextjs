'use client'
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "@/components/common/image";
import { cn, getDate, getImage } from "@/lib/utils";
import { useGetEvent } from "@/features/service/artspace/get-event";
import LoadingPage from "@/components/page/loading-page";
import Link from "@/components/common/link";
import { paths } from "@/config/paths";
import ArtworkCard from "@/components/app/artwork-card";
import MasonryItem from "@/components/app/masonry-item";
import { ScrollArea } from "@/components/ui/scroll-area";
import InterestEventButton from "@/components/app/interest-button";
import { ShareButton } from "@/components/common/share-button";
import { useAuth } from "@/features/auth/store";

const typeColorMap: Record<string, string> = {
   Solo: "bg-indigo-100 text-indigo-700",
   Group: "bg-emerald-100 text-emerald-700",
   Collector: "bg-amber-100 text-amber-700",
};

export default function EventDetailPage() {
   const { slug } = useParams<{ slug: string }>();
   const { accessToken } = useAuth();

   const eventQuery = useGetEvent({
      eventSlug: String(slug),
   });

   const event = eventQuery.data;

   if (eventQuery.isLoading || accessToken === undefined) {
      return <LoadingPage />;
   }

   if (!event) {
      return (
         <div className="container mx-auto py-20 text-center">
            <h1 className="text-2xl font-semibold">Event not found</h1>
            <p className="mt-2 text-muted-foreground">
               The event you are looking for does not exist.
            </p>
         </div>
      );
   }

   const startDate = event.start_date
      ? format(new Date(event.start_date), "MMM dd, yyyy")
      : null;

   const endDate = event.end_date
      ? format(new Date(event.end_date), "MMM dd, yyyy")
      : null;

   return (
      <div className="pb-24 sm:pb-16">
         {/* Hero */}
         <div className="relative min-h-[280px] sm:min-h-[360px] md:min-h-[420px] w-full">
            <Image
               src={getImage(event.cover_photo)}
               alt={event.title}
               className="absolute h-full w-full object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

            <div className="absolute bottom-4 sm:bottom-8 left-1/2 w-full -translate-x-1/2 px-4 sm:px-6">
               <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                     <Image
                        src={getImage(event.event_logo)}
                        alt="Event Logo"
                        className="w-16 h-16 rounded-sm aspect-video overflow-hidden border border-background object-cover"
                     />

                     <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-end mb-2">
                           <h1 className="text-2xl sm:text-3xl font-semibold text-white leading-tight">
                              {event.title}
                           </h1>
                           <ShareButton />
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                           <Badge className={typeColorMap[event.event_type]}>
                              {event.event_type}
                           </Badge>

                           {startDate && endDate && (
                              <p className="text-xs sm:text-sm text-white/90">
                                 {getDate(startDate)} – {getDate(endDate)}
                              </p>
                           )}
                        </div>

                        {event.interest_count > 0 && (
                           <span className="text-white/90 text-xs">
                              Interested by {event.interest_count}
                           </span>
                        )}
                     </div>
                  </div>
                  <InterestEventButton
                     size="lg"
                     eventId={String(event.id)}
                     interested={event.is_interested}
                  />
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="mx-auto mt-8 sm:mt-10 grid gap-8 lg:gap-10 px-4 lg:grid-cols-3">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-semibold">
                        About
                     </h2>
                     <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {event.about}
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-semibold">
                        Artists
                     </h2>

                     <div className="flex flex-wrap gap-2">
                        {event.artists.length > 0 ? (
                           event.artists.map((artist) => (
                              <Link
                                 to={paths.artists.detail.getHref(
                                    String(artist.id)
                                 )}
                                 key={artist.id}
                              >
                                 <Badge variant="outline">
                                    {artist.first_name} {artist.last_name}
                                 </Badge>
                              </Link>
                           ))
                        ) : (
                           <p className="text-sm text-muted-foreground">
                              No artists listed.
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-semibold">
                        Artworks
                     </h2>

                     {event.artworks.length > 0 ? (
                        <ScrollArea className="h-[500px]">
                           <div
                              className={cn(
                                 "grid grid-cols-[repeat(auto-fill,minmax(180px,1fr))] gap-x-2 auto-rows-[1px]"
                              )}
                           >
                              {event.artworks.map((artwork) => (
                                 <MasonryItem
                                    key={artwork.id}
                                    artwork={artwork}
                                    pure
                                 >
                                    <ArtworkCard
                                       variant="masonry"
                                       className="inline-block w-full h-auto"
                                       artwork={artwork}
                                       pure
                                    />
                                 </MasonryItem>
                              ))}
                           </div>
                        </ScrollArea>
                     ) : (
                        <p className="text-sm text-muted-foreground">
                           No artworks available.
                        </p>
                     )}
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-semibold">
                        Images
                     </h2>

                     {event.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4">
                           {event.images.map((img) => (
                              <div
                                 key={img.id}
                                 className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                              >
                                 <Image
                                    src={getImage(img.url)}
                                    alt={img.caption}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                 />
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-muted-foreground">
                           No images available.
                        </p>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Right column */}
            <aside className="space-y-6 lg:sticky lg:top-24">
               <Card>
                  <CardContent>
                     <h3 className="text-sm font-medium text-muted-foreground">
                        Event Type
                     </h3>
                     <Badge className={typeColorMap[event.event_type]}>
                        {event.event_type}
                     </Badge>
                  </CardContent>
               </Card>

               {startDate && endDate && (
                  <Card>
                     <CardContent>
                        <h3 className="text-sm font-medium text-muted-foreground">
                           Event Dates
                        </h3>
                        <p className="text-sm sm:text-base">
                           {getDate(startDate)} – {getDate(endDate)}
                        </p>
                     </CardContent>
                  </Card>
               )}
            </aside>
         </div>

         {/* Fixed Interested Button (Mobile Only) */}
         {/* <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden">
            <div className="bg-background border-t px-4 py-3">
               <InterestEventButton
                  className="w-full"
                  eventId={String(event.id)}
                  interested={event.is_interested}
               />
            </div>
         </div> */}
      </div>
   );
}
