import { useRef, useEffect } from "react";
import { FreeMode, Navigation, Thumbs } from "swiper/modules";

import Viewer from "viewerjs";

import { getImage } from "@/lib/utils";
import type { Artwork } from "@/types";
import Image from "@/components/common/image";

export default function ArtworkImage({ artwork }: { artwork: Artwork }) {
   const mainImage = useRef(null); // ref for viewer

   useEffect(() => {
      if (mainImage.current) {
         const viewer = new Viewer(mainImage.current, {
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
         <div ref={mainImage} className="w-full">
            <Image
               ref={mainImage as unknown as React.RefObject<HTMLImageElement>}
               className="select-none flex justify-center mb-4 [&_img]:hover:cursor-zoom-in w-full h-[300px] [&_img]:object-contain [&_img]:h-[300px] [&_img]:w-auto"
               src={getImage(artwork.image)}
               alt={artwork.title}
               // src={`https://swiperjs.com/demos/images/nature-${i + 1}.jpg`}
            />
         </div>
      </>
   );
}
