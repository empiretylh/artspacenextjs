'use client'
import ArtworkCard from "@/components/app/artwork-card";
import type { Artwork } from "@/types";
import { useEffect, useRef, useState } from "react";

const MasonryItem = ({
   artwork,
   children,
   pure = false,
}: {
   artwork: Artwork;
   children?: React.ReactNode;
   pure?: boolean;
}) => {
   const ref = useRef<HTMLDivElement>(null);
   const [span, setSpan] = useState(() => {
      // Calculate initial span to prevent flashing
      const rowHeight = 1; // match your grid-auto-rows
      const extra = pure ? 8 : 115 + 8; // same extra spacing
      return (
         Math.ceil(
            ((artwork.original_height / artwork.original_width) * 200) /
            rowHeight
         ) + extra
      );
      // 300 is a reasonable default width if exact width is unknown
   });

   useEffect(() => {
      if (!ref.current) return;

      const el = ref.current;

      let timeoutId: NodeJS.Timeout;

      const observer = new ResizeObserver(([entry]) => {
         // Debounce updates to prevent multiple re-renders
         clearTimeout(timeoutId);
         timeoutId = setTimeout(() => {
            const width = entry.contentRect.width;
            const height =
               (artwork.original_height / artwork.original_width) * width;

            const rowHeight = 1;
            const extra = pure ? 8 : 115 + 8;

            setSpan(Math.ceil(height / rowHeight) + extra);
         }, 50); // small delay
      });

      observer.observe(el);

      return () => {
         observer.disconnect();
         clearTimeout(timeoutId);
      };
   }, [artwork]);

   return (
      <div
         ref={ref}
         data-testid="artwork-card"
         style={{ gridRow: `span ${span}` }}
         className="mb-2"
      >
         {children || (
            <ArtworkCard
               variant="masonry"
               className="inline-block w-full h-auto"
               artwork={artwork}
            />
         )}
      </div>
   );
};

export default MasonryItem;
