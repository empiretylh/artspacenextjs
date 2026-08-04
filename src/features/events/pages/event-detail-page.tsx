'use client'
import ArtworkCard from "@/components/app/artwork-card";
import InterestEventButton from "@/components/app/interest-button";

import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { ShareButton } from "@/components/common/share-button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { paths } from "@/config/paths";
import { useGetEvent } from "@/features/service/artspace/get-event";
import { useGetEventInterestStatus } from "@/features/service/artspace/get-event-intereset-status";
import { eventAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import { cn, getDate, getImage } from "@/lib/utils";
import { format } from "date-fns";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";

const typeColorMap: Record<string, string> = {
   Solo: "bg-indigo-100 text-indigo-700",
   Group: "bg-emerald-100 text-emerald-700",
   Collector: "bg-amber-100 text-amber-700",
};

export default function EventDetailPage() {
   const t = useTranslations("Events");
   const { slug } = useParams<{ slug: string }>();

   const eventQuery = useGetEvent({
      eventSlug: String(slug),
   });

   const eventInterestStatus = useGetEventInterestStatus({
      eventSlug: String(slug),
   })

   const event = eventQuery.data;

   const { source } = useSource()

   useEffect(() => {
      if (event) {
         eventAnalytics.view(event.id, event.event_type.toLowerCase() as Lowercase<typeof event.event_type>, source);
      }
   }, [event]);

   if (!event) {
      return (
         notFound()
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
         <div className="relative w-screen md:w-full ml-[50%] translate-x-[-50%] aspect-[16/9] max-h-[90dvh]">
            <AppImage
               src={getImage(event.cover_photo)}
               alt={event.title}
               fill
               preload
               className="object-cover"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

            <div className="absolute bottom-4 sm:bottom-8 left-1/2 w-full -translate-x-1/2 px-4 sm:px-6">
               <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                     <AppImage
                        src={getImage(event.event_logo)}
                        alt="Event Logo"
                        width={64}
                        height={64}
                        containerClassName="w-16 h-16 sm:w-20 sm:h-20"
                        className="rounded-sm border border-background object-cover"
                     />
                     <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-end mb-2">
                           <h1 className="text-2xl sm:text-3xl font-bold font-display text-white leading-tight">
                              {event.title}
                           </h1>
                           <ShareButton content_type="event" item_id={String(event.id)} item_name={event.title} className="text-white" />
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
                              {t("interestedBy", { count: event.interest_count })}
                           </span>
                        )}
                     </div>
                  </div>
                  <InterestEventButton
                     size="lg"
                     loading={eventInterestStatus.isLoading}
                     eventId={String(event.id)}
                     interested={eventInterestStatus.data || false}
                  />
               </div>
            </div>
         </div>

         {/* Content */}
         <div className="mx-auto mt-8 sm:mt-10 grid gap-8 lg:gap-10 lg:px-2 lg:grid-cols-2">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-8">
               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-bold font-display">
                        {t("about")}
                     </h2>
                     <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {event.about}
                     </p>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-bold font-display">
                        {t("artists")}
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
                              {t("noArtists")}
                           </p>
                        )}
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-bold font-display">
                        {t("artworks")}
                     </h2>

                     {event.artworks.length > 0 ? (
                        <ScrollArea className="h-[500px]">
                           <div
                              className={cn(
                                 "grid grid-cols-2 sm:grid-cols-3 gap-4"
                              )}
                           >
                              {event.artworks.map((artwork) => (
                                 <ArtworkCard
                                    key={artwork.id}
                                    artwork={artwork}
                                 />
                              ))}
                           </div>
                        </ScrollArea>
                     ) : (
                        <p className="text-sm text-muted-foreground">
                           {t("noArtworks")}
                        </p>
                     )}
                  </CardContent>
               </Card>

               <Card>
                  <CardContent>
                     <h2 className="text-base sm:text-lg mb-2 font-bold font-display">
                        {t("images")}
                     </h2>

                     {event.images.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4">
                           {event.images.map((img) => (
                              <div
                                 key={img.id}
                                 className="group relative aspect-square overflow-hidden rounded-md border bg-muted"
                              >
                                 <AppImage
                                    src={getImage(img.url)}
                                    alt={img.caption ?? "Event image"}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                 />
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-muted-foreground">
                           {t("noImages")}
                        </p>
                     )}
                  </CardContent>
               </Card>
            </div>

            {/* Right column */}
            {/* <aside className="space-y-6 lg:sticky lg:top-24">
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
            </aside> */}
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
