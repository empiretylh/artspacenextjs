import React, { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "@/assets/css/swiper.css";

import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import Viewer from "viewerjs";

import { getImage } from "@/lib/utils";
import type { Swiper as SwiperType } from "swiper/types";

export default function ArtworkImageCarousel({ images }: { images: string[] }) {
   const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
   const mainSwiperRef = useRef(null); // ref for viewer

   useEffect(() => {
      if (mainSwiperRef.current) {
         const viewer = new Viewer(mainSwiperRef.current, {
            toolbar: true,
            backdrop: true,
            fullscreen: true,
            url: "src", // viewer should use img src
            // show() {
            //    disableBodyScroll(document.body);
            // },
            // hide() {
            //    enableBodyScroll(document.body);
            // },
         });

         return () => {
            viewer.destroy();
            // You can add any additional cleanup logic here
         };
      }
   }, []);

   return (
      <>
         {/* ⭐ Viewer.js attaches to this wrapper */}
         <div ref={mainSwiperRef} className="rounded-xl">
            <Swiper
               spaceBetween={10}
               navigation={true}
               thumbs={{ swiper: thumbsSwiper }}
               modules={[FreeMode, Navigation, Thumbs]}
               className="artwork-image-viewer"
            >
               {images.map((image, i) => (
                  <SwiperSlide key={i}>
                     <img
                        className="select-none"
                        src={getImage(image)}
                        // src={`https://swiperjs.com/demos/images/nature-${i + 1}.jpg`}
                     />
                  </SwiperSlide>
               ))}
            </Swiper>
         </div>

         <Swiper
            onSwiper={(swiper) => setThumbsSwiper(swiper)}
            spaceBetween={10}
            slidesPerView={4}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="main-swiper"
         >
            {images.map((image, i) => (
               <SwiperSlide key={i}>
                  <img
                     className="select-none"
                     src={getImage(image)}
                     // src={`https://swiperjs.com/demos/images/nature-${i + 1}.jpg`}
                  />
               </SwiperSlide>
            ))}
         </Swiper>
      </>
   );
}
