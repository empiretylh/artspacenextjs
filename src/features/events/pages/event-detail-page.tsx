'use client';

import ArtworkCard from "@/components/app/artwork-card";
import InterestEventButton from "@/components/app/interest-button";
import AppImage from "@/components/common/app-image";
import Link from "@/components/common/link";
import { ShareButton } from "@/components/common/share-button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { paths } from "@/config/paths";
import { useGetEvent } from "@/features/service/artspace/get-event";
import { useGetEventInterestStatus } from "@/features/service/artspace/get-event-intereset-status";
import { useSafeBack } from "@/hooks/use-safe-back";
import { eventAnalytics } from "@/lib/analytics";
import { useSource } from "@/lib/analytics-source";
import { cn, getDate, getImage, getUserDisplayName } from "@/lib/utils";
import { format } from "date-fns";
import { ArrowLeft, Calendar, Maximize2, Palette, Users } from "lucide-react";
import { useTranslations } from "next-intl";
import { notFound, useParams } from "next/navigation";
import { useEffect } from "react";
import EventDetailPageSkeleton from "./event-detail-skeleton";

const typeColorMap: Record<string, string> = {
   Solo: "bg-indigo-100 text-indigo-700",
   Group: "bg-emerald-100 text-emerald-700",
   Collector: "bg-amber-100 text-amber-700",
   SOLO: "bg-indigo-100 text-indigo-700",
   GROUP: "bg-emerald-100 text-emerald-700",
   COLLECTOR: "bg-amber-100 text-amber-700",
};

export default function EventDetailPage() {
   const t = useTranslations("Events");
   const { slug } = useParams<{ slug: string }>();
   const { goBack } = useSafeBack(paths.events.path);

   const eventQuery = useGetEvent({
      eventSlug: String(slug),
   });

   const eventInterestStatus = useGetEventInterestStatus({
      eventSlug: String(slug),
   });

   const event = eventQuery.data;
   const { source } = useSource();

   useEffect(() => {
      if (event) {
         eventAnalytics.view(
            event.id,
            event.event_type.toLowerCase() as Lowercase<typeof event.event_type>,
            source
         );
      }
   }, [event, source]);

   if (eventQuery.isLoading) {
      return <EventDetailPageSkeleton />;
   }

   if (eventQuery.isError || !event) {
      return notFound();
   }

   const startDate = event.start_date
      ? format(new Date(event.start_date), "MMM dd, yyyy")
      : null;

   const endDate = event.end_date
      ? format(new Date(event.end_date), "MMM dd, yyyy")
      : null;

   return (
      <div className="pb-24 sm:pb-16">
         {/* Hero Banner (Restored to original UI with full-bleed cover & bottom gradient overlay) */}
         <div className="relative w-screen md:w-full ml-[50%] translate-x-[-50%] aspect-[4/3] sm:aspect-video md:aspect-[2/1] min-h-[320px] sm:min-h-0 max-h-[90dvh]">
            <AppImage
               src={getImage(event.cover_photo)}
               alt={event.title}
               fill
               preload
               className="object-cover"
            />

            {/* Back Button */}
            <Button
               variant="secondary"
               size="sm"
               onClick={goBack}
               className="absolute top-4 left-4 z-20 rounded-full bg-black/40 text-white hover:bg-black/60 border-0 backdrop-blur-xs gap-1.5 px-3 text-xs"
            >
               <ArrowLeft className="h-4 w-4" />
               <span className="hidden sm:inline">{t("backToEvents")}</span>
            </Button>

            {/* Fullscreen Dialog Trigger */}
            <Dialog>
               <DialogTrigger asChild>
                  <Button
                     variant="secondary"
                     size="icon"
                     className="absolute top-4 right-4 z-20 rounded-full bg-black/40 text-white hover:bg-black/60 border-0"
                     title={t("viewFullImage")}
                  >
                     <Maximize2 className="h-4 w-4" />
                  </Button>
               </DialogTrigger>
               <DialogContent className="max-w-[100vw] w-screen h-[100dvh] sm:max-w-[100vw] bg-black/95 border-none ring-0 p-0 rounded-none flex items-center justify-center shadow-none [&>button]:text-white [&>button]:bg-white/10 [&>button]:hover:bg-white/20 [&>button]:top-4 [&>button]:right-4 [&>button]:w-10 [&>button]:h-10 [&>button]:rounded-full [&>button]:border-0">
                  <DialogTitle className="sr-only">
                     Full view of {event.title} banner
                  </DialogTitle>
                  <div className="relative w-full h-full max-w-[1400px] max-h-[100dvh] mx-auto p-4 sm:p-8">
                     <AppImage
                        src={getImage(event.cover_photo)}
                        alt={event.title}
                        fill
                        className="object-contain"
                     />
                  </div>
               </DialogContent>
            </Dialog>

            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

            {/* Overlay content: Event Logo, Title, Dates, Badges & Interest Button */}
            <div className="absolute bottom-4 sm:bottom-8 left-1/2 w-full -translate-x-1/2 px-4 sm:px-6">
               <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                     {event.event_logo && (
                        <AppImage
                           src={getImage(event.event_logo)}
                           alt="Event Logo"
                           width={64}
                           height={64}
                           containerClassName="w-16 h-16 sm:w-20 sm:h-20 shrink-0"
                           className="rounded-sm border border-background object-cover"
                        />
                     )}
                     <div className="flex flex-col gap-1">
                        <div className="flex gap-2 items-end mb-2">
                           <h1 className="text-2xl sm:text-3xl font-semibold font-display text-white leading-tight">
                              {event.title}
                           </h1>
                           <ShareButton
                              content_type="event"
                              item_id={String(event.id)}
                              item_name={event.title}
                              className="text-white hover:text-white/80"
                           />
                        </div>

                        <div className="flex items-center gap-3 mb-2">
                           <Badge className={typeColorMap[event.event_type] || "bg-primary text-primary-foreground"}>
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

         {/* Content Grid: Left Column (Content, Artists, Artworks, Images) + Right Sticky Overview */}
         <div className="mx-auto mt-8 sm:mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
            {/* Left column */}
            <div className="lg:col-span-2 space-y-10">
               {/* About Section */}
               <section className="space-y-3" aria-labelledby="event-about-heading">
                  <h2
                     id="event-about-heading"
                     className="text-lg sm:text-xl font-semibold font-display tracking-tight text-foreground"
                  >
                     {t("about")}
                  </h2>
                  <p className="text-base text-foreground/85 leading-relaxed whitespace-pre-line">
                     {event.about}
                  </p>
               </section>

               {/* Featured Artists Section (Only when artists exist) */}
               {event.artists && event.artists.length > 0 && (
                  <section className="space-y-4" aria-labelledby="event-artists-heading">
                     <div className="flex items-center gap-2">
                        <h2
                           id="event-artists-heading"
                           className="text-lg sm:text-xl font-semibold font-display tracking-tight text-foreground"
                        >
                           {t("artists")}
                        </h2>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                           {event.artists.length}
                        </span>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {event.artists.map((artist) => {
                           const displayName = getUserDisplayName(artist);
                           const avatarSrc = artist.avatar || artist.profile?.profile_picture;

                           return (
                              <Link
                                 key={artist.id}
                                 to={paths.artists.detail.getHref(String(artist.id))}
                                 className="flex items-center gap-3.5 p-3 rounded-xl border border-border/70 hover:border-border hover:bg-muted/40 transition-all duration-200 group bg-card"
                              >
                                 <Avatar className="w-11 h-11 border border-border shrink-0">
                                    <AvatarImage
                                       src={avatarSrc ? getImage(avatarSrc) : undefined}
                                       alt={displayName}
                                       className="object-cover"
                                    />
                                    <AvatarFallback className="font-semibold text-xs uppercase bg-muted">
                                       {displayName.slice(0, 2)}
                                    </AvatarFallback>
                                 </Avatar>
                                 <div className="min-w-0 flex-1">
                                    <p className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors truncate">
                                       {displayName}
                                    </p>
                                    {artist.username && (
                                       <p className="text-xs text-muted-foreground truncate">
                                          @{artist.username}
                                       </p>
                                    )}
                                 </div>
                              </Link>
                           );
                        })}
                     </div>
                  </section>
               )}

               {/* Exhibition Artworks (Full Responsive Grid without scroll trap) */}
               <section className="space-y-4" aria-labelledby="event-artworks-heading">
                  <div className="flex items-center gap-2">
                     <h2
                        id="event-artworks-heading"
                        className="text-lg sm:text-xl font-semibold font-display tracking-tight text-foreground"
                     >
                        {t("artworks")}
                     </h2>
                     {event.artworks && event.artworks.length > 0 && (
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                           {event.artworks.length}
                        </span>
                     )}
                  </div>

                  {event.artworks && event.artworks.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                        {event.artworks.map((artwork) => (
                           <ArtworkCard
                              key={artwork.id}
                              artwork={artwork}
                              showLikeButton={false}
                              publicCard={false}
                           />
                        ))}
                     </div>
                  ) : (
                     <div className="p-8 text-center rounded-xl border border-dashed border-border/70 bg-muted/20">
                        <p className="text-sm text-muted-foreground">{t("noArtworks")}</p>
                     </div>
                  )}
               </section>

               {/* Exhibition Photos / Images (Only when available, with Lightbox) */}
               {event.images && event.images.length > 0 && (
                  <section className="space-y-4" aria-labelledby="event-images-heading">
                     <div className="flex items-center gap-2">
                        <h2
                           id="event-images-heading"
                           className="text-lg sm:text-xl font-semibold font-display tracking-tight text-foreground"
                        >
                           {t("images")}
                        </h2>
                        <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                           {event.images.length}
                        </span>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {event.images.map((img) => (
                           <Dialog key={img.id}>
                              <DialogTrigger asChild>
                                 <div className="group relative aspect-square overflow-hidden rounded-xl border border-border/70 bg-muted cursor-pointer shadow-2xs">
                                    <AppImage
                                       src={getImage(img.url)}
                                       alt={img.caption || "Event image"}
                                       fill
                                       sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                       className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                                       <Maximize2 className="w-5 h-5 text-white drop-shadow-md" />
                                    </div>
                                 </div>
                              </DialogTrigger>
                              <DialogContent className="max-w-[100vw] w-screen h-[100dvh] bg-black/95 border-none ring-0 p-0 rounded-none flex items-center justify-center shadow-none [&>button]:text-white [&>button]:bg-white/10 [&>button]:hover:bg-white/20 [&>button]:top-4 [&>button]:right-4 [&>button]:w-10 [&>button]:h-10 [&>button]:rounded-full [&>button]:border-0">
                                 <DialogTitle className="sr-only">
                                    {img.caption || "Event image preview"}
                                 </DialogTitle>
                                 <div className="relative w-full h-full max-w-[1400px] max-h-[100dvh] mx-auto p-4 sm:p-8 flex flex-col items-center justify-center">
                                    <div className="relative w-full h-full max-h-[85vh]">
                                       <AppImage
                                          src={getImage(img.url)}
                                          alt={img.caption || "Event image"}
                                          fill
                                          className="object-contain"
                                       />
                                    </div>
                                    {img.caption && (
                                       <p className="mt-3 text-sm text-white/80 text-center max-w-xl">
                                          {img.caption}
                                       </p>
                                    )}
                                 </div>
                              </DialogContent>
                           </Dialog>
                        ))}
                     </div>
                  </section>
               )}
            </div>

            {/* Right Column: Sticky Exhibition Overview Sidebar */}
            <aside
               className="lg:col-span-1 lg:sticky lg:top-24 space-y-5"
               aria-label="Exhibition Overview"
            >
               <Card className="py-0 gap-0 border border-border/80 shadow-xs rounded-xl overflow-hidden">
                  <CardContent className="p-5 sm:p-6 space-y-5">
                     <h3 className="font-semibold font-display text-base text-foreground border-b border-border/50 pb-3">
                        {t("eventOverview")}
                     </h3>

                     {/* Key Specs */}
                     <div className="space-y-3.5 text-sm">
                        {startDate && endDate && (
                           <div className="flex items-start gap-3">
                              <Calendar className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                 <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    {t("dates")}
                                 </p>
                                 <p className="font-medium text-foreground">
                                    {getDate(startDate)} – {getDate(endDate)}
                                 </p>
                              </div>
                           </div>
                        )}

                        <div className="flex items-start gap-3">
                           <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-medium", typeColorMap[event.event_type] || "")}>
                              {event.event_type}
                           </Badge>
                        </div>

                        {event.artworks && (
                           <div className="flex items-start gap-3 pt-1">
                              <Palette className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                 <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    {t("artworksCount")}
                                 </p>
                                 <p className="font-medium text-foreground">
                                    {event.artworks.length}
                                 </p>
                              </div>
                           </div>
                        )}

                        {event.artists && event.artists.length > 0 && (
                           <div className="flex items-start gap-3">
                              <Users className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                              <div className="min-w-0">
                                 <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
                                    {t("artists")}
                                 </p>
                                 <p className="font-medium text-foreground">
                                    {event.artists.length}
                                 </p>
                              </div>
                           </div>
                        )}
                     </div>

                     {/* Primary CTA in sidebar: Side-by-side with Interested & Share */}
                     <div className="pt-2 sm:pt-3 flex items-center gap-2.5">
                        <InterestEventButton
                           size="lg"
                           className="flex-1 w-full"
                           loading={eventInterestStatus.isLoading}
                           eventId={String(event.id)}
                           interested={eventInterestStatus.data || false}
                        />

                        <ShareButton
                           content_type="event"
                           item_id={String(event.id)}
                           item_name={event.title}
                           variant="outline"
                           size="lg"
                           className="shrink-0 w-10 h-10 p-0 flex items-center justify-center rounded-md"
                        />
                     </div>
                  </CardContent>
               </Card>
            </aside>
         </div>
      </div>
   );
}
