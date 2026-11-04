"use client";

import { cn, getImage } from "@/lib/utils";
import type { StorePreviewConfig } from "@/types";

type ProductPreviewProps = {
   /** Blank mockup photo for the selected colourway. */
   mockupUrl?: string | null;
   /** Artwork image composited into the print area. */
   artworkUrl?: string | null;
   /** Merged product preview_config; never the type copy. */
   previewConfig?: StorePreviewConfig;
   /** Garment colour, used for the tint layer over the print area. */
   colorHex?: string | null;
   alt: string;
   className?: string;
};

const FALLBACK_AREA = { x: 0.3, y: 0.25, w: 0.4, h: 0.45, rotation: 0 };

/**
 * Three stacked image layers: the blank colourway mockup, the artwork clipped
 * into the normalised print area, and a translucent tint of the garment colour
 * over that area so the ink reads as printed on fabric rather than pasted on.
 *
 * All placement comes from preview_config, so an admin retunes a print without a
 * deploy. Angles and per-angle photography are not in the phase 1 model, so a
 * multi-angle config is intentionally not rendered here yet.
 */
export const ProductPreview = ({
   mockupUrl,
   artworkUrl,
   previewConfig,
   colorHex,
   alt,
   className,
}: ProductPreviewProps) => {
   const area = { ...FALLBACK_AREA, ...(previewConfig?.print_area ?? {}) };
   const blendMode = previewConfig?.blend_mode ?? "multiply";

   const printLayer = (child: React.ReactNode) => (
      <div
         aria-hidden="true"
         className="pointer-events-none absolute"
         style={{
            left: `${area.x * 100}%`,
            top: `${area.y * 100}%`,
            width: `${area.w * 100}%`,
            height: `${area.h * 100}%`,
            transform: `rotate(${area.rotation ?? 0}deg)`,
            overflow: "hidden",
         }}
      >
         {child}
      </div>
   );

   return (
      <div
         className={cn(
            "relative aspect-square w-full overflow-hidden rounded-xl border border-border/60 bg-muted/30",
            className,
         )}
      >
         {mockupUrl ? (
            <img
               src={getImage(mockupUrl)}
               alt={alt}
               className="absolute inset-0 size-full object-contain"
               loading="lazy"
               draggable={false}
            />
         ) : (
            // No mockup photo uploaded yet: show the artwork on the garment
            // colour so the detail screen still reads as a product.
            <div
               className="absolute inset-0"
               style={{ backgroundColor: colorHex || undefined }}
            />
         )}

         {artworkUrl
            ? printLayer(
                 <img
                    src={getImage(artworkUrl)}
                    alt=""
                    className="size-full object-cover"
                    style={{
                       mixBlendMode: blendMode as React.CSSProperties["mixBlendMode"],
                    }}
                    loading="lazy"
                    draggable={false}
                 />,
              )
            : null}

         {/* Tint so printed ink picks up the fabric colour. Skipped when there is
             no mockup, because the colour already fills the frame. */}
         {mockupUrl && colorHex
            ? printLayer(
                 <div
                    className="size-full"
                    style={{
                       backgroundColor: colorHex,
                       opacity: 0.18,
                       mixBlendMode: "multiply",
                    }}
                 />,
              )
            : null}
      </div>
   );
};

export default ProductPreview;
