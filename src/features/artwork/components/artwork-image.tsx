'use client'

import { useEffect, useRef } from "react";
import Viewer from "viewerjs";
import Image from "@/components/common/image";
import { getImage } from "@/lib/utils";
import type { Artwork } from "@/types";
import { Maximize2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ArtworkImage({ artwork }: { artwork: Artwork }) {
   const imgRef = useRef<HTMLImageElement | null>(null);
   const viewerRef = useRef<Viewer | null>(null);
   const t = useTranslations("Artwork.detail");

   useEffect(() => {
      if (imgRef.current) {
         viewerRef.current = new Viewer(imgRef.current, {
            toolbar: true,
            backdrop: true,
            fullscreen: true,
            url: "src",
         });

         return () => {
            viewerRef.current?.destroy();
            viewerRef.current = null;
         };
      }
   }, []);

   const handleOpenZoom = () => {
      viewerRef.current?.show();
   };

   return (
      <figure className="relative w-full rounded-xl overflow-hidden bg-card border border-border/70">
         <div
            onClick={handleOpenZoom}
            className="w-full min-h-[350px] sm:min-h-[460px] lg:min-h-[540px] max-h-[75vh] p-4 sm:p-6 md:p-8 flex items-center justify-center cursor-zoom-in"
         >
            <Image
               ref={imgRef}
               className="select-none flex items-center justify-center w-full h-full max-h-[70vh] [&_img]:object-contain [&_img]:max-h-[70vh] [&_img]:w-auto [&_img]:mx-auto"
               src={getImage(artwork.image)}
               alt={`${artwork.title} artwork image`}
            />
         </div>

         {/* Expand Affordance Pill */}
         <button
            type="button"
            onClick={handleOpenZoom}
            className="absolute bottom-3 right-3 z-10 bg-background/85 hover:bg-background text-foreground/80 hover:text-foreground backdrop-blur-md border border-border/70 shadow-xs px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-all duration-200"
            title={t("viewFullscreen")}
            aria-label={t("viewFullscreen")}
         >
            <Maximize2 className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] sm:text-xs">{t("viewFullscreen")}</span>
         </button>
      </figure>
   );
}
