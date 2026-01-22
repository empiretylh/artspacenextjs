"use client";

import React, { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
   Carousel,
   CarouselContent,
   CarouselItem,
   CarouselNext,
   CarouselPrevious,
   type CarouselApi,
} from "@/components/ui/carousel";
import { cn, getDate, getImage } from "@/lib/utils";
import { paths } from "@/config/paths";
import Link from "@/components/common/link";
import { useRouter } from "next/navigation";
import { useGetPopUpEvents } from "@/features/service/artspace/get-pop-up-events";
import { Spinner } from "@/components/ui/spinner";
import { BaseDialog } from "@/components/common/dialogs/base-dialog";

export default function EventPopupSlider() {
   const [open, setOpen] = useState(false);
   const popUpEventsQuery = useGetPopUpEvents();
   const events = popUpEventsQuery.data?.data || [];
   // const events = [];
   const [api, setApi] = React.useState<CarouselApi>();
   const [current, setCurrent] = React.useState(0);
   const [count, setCount] = React.useState(0);

   const router = useRouter();

   React.useEffect(() => {
      if (!api) {
         return;
      }
      setCount(api.scrollSnapList().length);
      setCurrent(api.selectedScrollSnap() + 1);
      api.on("select", () => {
         setCurrent(api.selectedScrollSnap() + 1);
      });
   }, [api]);

   // useEffect(() => {
   //    const firstLoad = localStorage.getItem("artspace:firstLoadPopup");
   //    if (!firstLoad) {
   //       setOpen(true);
   //       localStorage.setItem("artspace:firstLoadPopup", "true");
   //    }
   // }, []);

   useEffect(() => {
      if (
         popUpEventsQuery.data?.data &&
         popUpEventsQuery.data.data.length > 0
      ) {
         setOpen(true);
      }
   }, [popUpEventsQuery.data?.data]);

   return (
      <>
         {/* <Button
            onClick={() => setOpen(true)}
            className="fixed top-10 left-1/2 z-[100]"
         >
            testing
         </Button> */}
         <BaseDialog
            title={`Event Pop Up`}
            description={"Check out our latest events!"}
            isOpen={open}
            onClose={() => setOpen(false)}
         >
            {popUpEventsQuery.isLoading && (
               <div className="flex items-center justify-center h-full">
                  <Spinner className="w-6 h-6" />
               </div>
            )}
            {!popUpEventsQuery.isLoading && (
               <Carousel setApi={setApi}>
                  <CarouselContent
                     className={cn(
                        "w-full mx-auto max-w-xs xs:max-w-sm sm:max-w-md rounded-lg"
                     )}
                  >
                     {events.map((event) => (
                        <CarouselItem
                           style={{
                              backgroundImage: `url(${getImage(event.images[0]?.url)})`,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                              position: "relative", // make overlay positioning relative
                           }}
                           key={event.id}
                           className="pl-0"
                        >
                           <div className="h-[500px] relative select-none">
                              {/* Overlay for readability */}
                              <div className="absolute inset-0 bg-black/50"></div>

                              {/* Content on top of overlay */}
                              <div className="relative z-10 p-4 flex flex-col justify-between h-full text-white">
                                 <div>
                                    <h1 className="font-display text-3xl">
                                       Events
                                    </h1>
                                 </div>
                                 <div>
                                    <Link
                                       to={paths.events.detail.getHref(
                                          event.slug
                                       )}
                                       onClick={(e) => {
                                          e.preventDefault();
                                          setOpen(false);
                                          router.push(
                                             paths.events.detail.getHref(
                                                event.slug
                                             )
                                          );
                                       }}
                                    >
                                       <h2 className="text-2xl font-bold mb-2 hover:underline">
                                          {event.title}
                                       </h2>
                                    </Link>
                                    <p className="mb-1">{event.about}</p>
                                    <p className="text-sm mb-2">
                                       {getDate(event.start_date)}
                                    </p>
                                    <Button
                                       onClick={() => {
                                          setOpen(false);
                                          router.push(
                                             paths.events.detail.getHref(
                                                event.slug
                                             )
                                          );
                                       }}
                                    >
                                       View Event
                                    </Button>
                                 </div>
                              </div>
                           </div>
                        </CarouselItem>
                     ))}
                  </CarouselContent>
                  <CarouselPrevious className="left-2" size={"lg"} />
                  <CarouselNext className="right-2" />
               </Carousel>
            )}
         </BaseDialog>
         {/* <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent
               className="max-w-[300px] rounded-lg sm:max-w-md h-[500px] p-0 overflow-hidden"
               onFocusOutside={(e) => e.stopPropagation()}
            ></DialogContent>
         </Dialog> */}
      </>
   );
}
