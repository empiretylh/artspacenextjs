import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LinkPreviewData } from "../types";
import { ExternalLink, Globe } from "lucide-react";

interface LinkPreviewCardProps {
   preview: LinkPreviewData;
   isMine: boolean;
}

export const LinkPreviewCard = ({ preview, isMine }: LinkPreviewCardProps) => {
   const [imageError, setImageError] = useState(false);
   const [faviconError, setFaviconError] = useState(false);

   if (!preview || !preview.url) return null;

   let hostname = preview.siteName;
   try {
      if (!hostname) {
         hostname = new URL(preview.url).hostname.replace(/^www\./, "");
      }
   } catch {
      hostname = preview.url;
   }

   const hasImage = Boolean(preview.image) && !imageError;

   return (
      <a
         href={preview.url}
         target="_blank"
         rel="noopener noreferrer"
         onClick={(e) => e.stopPropagation()}
         className={cn(
            "mt-2 block w-full rounded-xl overflow-hidden border transition-all group/card text-left select-none",
            isMine
               ? "bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground/15 text-primary-foreground"
               : "bg-background/80 border-border/80 hover:bg-background text-foreground shadow-2xs"
         )}
      >
         {/* Preview Thumbnail */}
         {hasImage && (
            <div className="relative w-full h-32 sm:h-36 bg-black/5 overflow-hidden">
               <img
                  src={preview.image!}
                  alt={preview.title || "Link preview"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-[1.02]"
                  loading="lazy"
                  onError={() => setImageError(true)}
               />
            </div>
         )}

         {/* Content info */}
         <div className="p-2.5 flex flex-col gap-1">
            {/* Domain & Favicon */}
            <div className="flex items-center gap-1.5 text-[11px] opacity-75 font-sans">
               {preview.favicon && !faviconError ? (
                  <img
                     src={preview.favicon}
                     alt=""
                     className="w-3.5 h-3.5 rounded-xs shrink-0 object-contain"
                     onError={() => setFaviconError(true)}
                  />
               ) : (
                  <Globe className="w-3.5 h-3.5 shrink-0" />
               )}
               <span className="truncate font-medium">{hostname}</span>
               <ExternalLink className="w-3 h-3 opacity-60 ml-auto shrink-0 group-hover/card:opacity-100 transition-opacity" />
            </div>

            {/* Title */}
            {preview.title && (
               <p
                  className={cn(
                     "text-xs font-semibold leading-snug line-clamp-2 font-sans",
                     isMine ? "text-primary-foreground" : "text-foreground"
                  )}
               >
                  {preview.title}
               </p>
            )}

            {/* Description */}
            {preview.description && (
               <p
                  className={cn(
                     "text-[11px] leading-relaxed line-clamp-2 font-sans",
                     isMine ? "text-primary-foreground/75" : "text-muted-foreground"
                  )}
               >
                  {preview.description}
               </p>
            )}
         </div>
      </a>
   );
};
