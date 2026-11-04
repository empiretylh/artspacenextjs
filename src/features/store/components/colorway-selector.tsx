"use client";

import { cn } from "@/lib/utils";
import type { ProductVariant } from "@/types";

export type ColorwayOption = {
   key: string;
   colorHex: string;
   colorName: string;
};

/**
 * A variant is colour x size, so the same colour repeats across sizes. Colour is
 * keyed on hex plus label to keep two swatches that share a hex but not a name.
 */
export const colorwayKeyOf = (
   variant: Pick<ProductVariant, "color_hex" | "color_name">,
): string => `${(variant.color_hex || "").toUpperCase()}|${variant.color_name}`;

export const getColorwayOptions = (variants: ProductVariant[]): ColorwayOption[] => {
   const seen = new Set<string>();
   const options: ColorwayOption[] = [];

   for (const variant of variants) {
      const key = colorwayKeyOf(variant);
      if (seen.has(key)) continue;
      seen.add(key);
      options.push({ key, colorHex: variant.color_hex, colorName: variant.color_name });
   }

   return options;
};

type ColorwaySelectorProps = {
   variants: ProductVariant[];
   selectedKey: string;
   onSelect: (key: string) => void;
   label?: string;
   disabled?: boolean;
   className?: string;
};

/**
 * Colourway swatches. Swapping one is the whole point of phase 1, so the target
 * stays generous (40px) and the buttons are real buttons: tab reaches them and
 * space/enter selects without extra key handlers.
 */
export const ColorwaySelector = ({
   variants,
   selectedKey,
   onSelect,
   label = "Colour",
   disabled = false,
   className,
}: ColorwaySelectorProps) => {
   const options = getColorwayOptions(variants);
   if (options.length === 0) return null;

   const selectedName = options.find((option) => option.key === selectedKey)?.colorName;

   return (
      <div className={cn("space-y-2", className)}>
         <div className="flex items-baseline justify-between gap-2">
            <span id="store-colorway-label" className="text-sm font-semibold text-foreground">
               {label}
            </span>
            {selectedName && (
               <span className="truncate text-xs text-muted-foreground">{selectedName}</span>
            )}
         </div>

         <div
            role="group"
            aria-labelledby="store-colorway-label"
            className="flex flex-wrap items-center gap-2.5"
         >
            {options.map((option) => {
               const isSelected = option.key === selectedKey;

               return (
                  <button
                     key={option.key}
                     type="button"
                     aria-pressed={isSelected}
                     aria-label={option.colorName}
                     title={option.colorName}
                     disabled={disabled}
                     onClick={() => onSelect(option.key)}
                     style={{ backgroundColor: option.colorHex || undefined }}
                     className={cn(
                        "size-10 shrink-0 rounded-full border-2 outline-none transition-all",
                        "focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                        "disabled:cursor-not-allowed disabled:opacity-50",
                        isSelected
                           ? "border-primary ring-2 ring-primary/30"
                           : "border-border/70 hover:scale-105 hover:border-border",
                     )}
                  >
                     <span className="sr-only">{option.colorName}</span>
                  </button>
               );
            })}
         </div>
      </div>
   );
};

export default ColorwaySelector;
