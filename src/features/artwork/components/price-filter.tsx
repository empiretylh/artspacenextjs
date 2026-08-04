import { useState, useEffect, useRef, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ColumnFiltersState } from "@/types";
import type { PriceFilterResponse } from "@/features/service/artspace/get-price-filter-options";

interface Props {
   priceFilterResponse?: PriceFilterResponse;
   filters: ColumnFiltersState;
   handleFilterChange: (id: string, value: string | number, checked: boolean) => void;
   handleCustomRangeChange?: (min: number, max: number) => void;
   debounceTime?: number;
   isLoading?: boolean;
}

export const PriceFilter: React.FC<Props> = ({
   priceFilterResponse,
   filters,
   handleFilterChange,
   handleCustomRangeChange,
   debounceTime = 500,
   isLoading = false,
}) => {
   const isInitialMount = useRef(true);
   const debounceRef = useRef<NodeJS.Timeout | null>(null);

   const defaultSliderMin = priceFilterResponse?.slider?.min ?? 0;
   const defaultSliderMax = priceFilterResponse?.slider?.max ?? 10000;
   const sliderStep = priceFilterResponse?.slider?.step ?? 50;

   const activeCheckedLevels = useMemo(() => {
      return filters
         .filter((f) => f.id === "price_range")
         .map((f) => String(f.value));
   }, [filters]);

   const activePriceMin = useMemo(() => {
      const val = filters.find((f) => f.id === "price_min")?.value;
      return val !== undefined && val !== null ? Number(val) : defaultSliderMin;
   }, [filters, defaultSliderMin]);

   const activePriceMax = useMemo(() => {
      const val = filters.find((f) => f.id === "price_max")?.value;
      return val !== undefined && val !== null ? Number(val) : defaultSliderMax;
   }, [filters, defaultSliderMax]);

   const [sliderValue, setSliderValue] = useState<[number, number]>([
      activePriceMin,
      activePriceMax,
   ]);

   // Sync local state with URL/filters
   useEffect(() => {
      setSliderValue([activePriceMin, activePriceMax]);
   }, [activePriceMin, activePriceMax]);

   /**
    * Apply filter when SLIDER is dragged (debounced)
    */
   useEffect(() => {
      if (isInitialMount.current) return;

      const currentMin = filters.find((f) => f.id === "price_min")?.value;
      const currentMax = filters.find((f) => f.id === "price_max")?.value;

      // If the slider is at defaults and there are no active price_min/price_max filters,
      // do not unnecessarily add them to URL params
      const isAtDefault =
         sliderValue[0] === defaultSliderMin &&
         sliderValue[1] === defaultSliderMax;
      if (isAtDefault && currentMin === undefined && currentMax === undefined)
         return;

      if (
         Number(currentMin) === sliderValue[0] &&
         Number(currentMax) === sliderValue[1]
      )
         return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
         if (handleCustomRangeChange) {
            handleCustomRangeChange(sliderValue[0], sliderValue[1]);
         } else {
            handleFilterChange("price_min", sliderValue[0], true);
            handleFilterChange("price_max", sliderValue[1], true);
         }
      }, debounceTime);

      return () => {
         if (debounceRef.current) clearTimeout(debounceRef.current);
      };
   }, [
      sliderValue,
      defaultSliderMin,
      defaultSliderMax,
      debounceTime,
      handleCustomRangeChange,
      handleFilterChange,
   ]);

   /**
    * Mark initialization complete AFTER first render
    */
   useEffect(() => {
      isInitialMount.current = false;
   }, []);

   const currencySymbol =
      (priceFilterResponse?.currency as any)?.display_symbol ||
      priceFilterResponse?.currency?.symbol ||
      "$";

   if (isLoading) {
      return (
         <div className="flex flex-col gap-5 py-2 animate-pulse">
            <div className="flex flex-col gap-4">
               {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                     <div className="size-5 rounded-md bg-muted" />
                     <div className="h-4 w-32 bg-muted rounded-sm" />
                  </div>
               ))}
            </div>
            <div className="flex flex-col gap-3 pt-2">
               <div className="flex justify-between">
                  <div className="h-3 w-16 bg-muted rounded-sm" />
                  <div className="h-3 w-16 bg-muted rounded-sm" />
               </div>
               <div className="h-2 w-full bg-muted rounded-full" />
            </div>
         </div>
      );
   }

   return (
      <div className="flex flex-col gap-5 py-2">
         {/* Preset ranges */}
         {priceFilterResponse?.price_ranges && priceFilterResponse.price_ranges.length > 0 && (
            <div className="flex flex-col gap-4">
               {priceFilterResponse.price_ranges.map((range) => {
                  const value = range.value;
                  const isChecked = activeCheckedLevels.includes(value);

                  return (
                     <div
                        key={range.label}
                        className="flex items-center gap-3 group cursor-pointer"
                     >
                        <Checkbox
                           id={`price-${range.label}`}
                           checked={isChecked}
                           onCheckedChange={(checked) => {
                              handleFilterChange("price_range", value, !!checked);
                           }}
                           className="size-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                        />
                        <Label
                           htmlFor={`price-${range.label}`}
                           className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors"
                        >
                           {range.label}
                        </Label>
                     </div>
                  );
               })}
            </div>
         )}

         {/* Slider */}
         <div className="flex flex-col gap-3 pt-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
               <Label className="text-xs font-bold cursor-default">
                  Min: {currencySymbol}
                  {sliderValue[0].toLocaleString()}
               </Label>
               <Label className="text-xs font-bold cursor-default">
                  Max: {currencySymbol}
                  {sliderValue[1].toLocaleString()}
               </Label>
            </div>

            <Slider
               value={sliderValue}
               min={defaultSliderMin}
               max={defaultSliderMax}
               step={sliderStep}
               onValueChange={(value) =>
                  setSliderValue(value as [number, number])
               }
            />
         </div>
      </div>
   );
};
