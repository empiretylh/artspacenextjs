import { useState, useEffect, useRef, useMemo } from "react";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ColumnFiltersState } from "@/types";

interface PriceRange {
   label: string;
   min: number;
   max: number;
}

interface Props {
   filterOptions: { priceRanges: PriceRange[] };
   filters: ColumnFiltersState;
   handleFilterChange: (id: string, value: string, checked: boolean) => void;
   debounceTime?: number;
}

export const PriceFilter: React.FC<Props> = ({
   filterOptions,
   filters,
   handleFilterChange,
   debounceTime = 500,
}) => {
   const isInitialMount = useRef(true);
   const debounceRef = useRef<NodeJS.Timeout | null>(null);

   const lastPriceFilter = useMemo(() => {
      return filters.filter((f) => f.id === "price_range").at(-1);
   }, [filters]);

   const defaultSliderValue = useMemo<[number, number]>(() => {
      if (lastPriceFilter?.value) {
         const [min, max] = lastPriceFilter.value
            .toString()
            .split("-")
            .map(Number);
         if (!Number.isNaN(min) && !Number.isNaN(max)) {
            return [min, max];
         }
      }
      return [0, 10000];
   }, [lastPriceFilter]);

   const [sliderValue, setSliderValue] =
      useState<[number, number]>(defaultSliderValue);

   const [selectedRadio, setSelectedRadio] = useState<string | null>(null);

   /**
    * Sync internal state FROM external filters
    * (does NOT trigger filter updates)
    */
   useEffect(() => {
      if (!lastPriceFilter?.value) {
         setSliderValue([0, 10000]);
         setSelectedRadio(null);
         return;
      }

      const [min, max] = lastPriceFilter.value
         .toString()
         .split("-")
         .map(Number);

      if (!Number.isNaN(min) && !Number.isNaN(max)) {
         setSliderValue([min, max]);
         setSelectedRadio(`${min}-${max}`);
      }
   }, [lastPriceFilter]);

   /**
    * Apply filter when RADIO is changed by user
    */
   useEffect(() => {
      if (isInitialMount.current) return;
      if (!selectedRadio) return;

      handleFilterChange("price_range", selectedRadio, true);
   }, [selectedRadio]);

   /**
    * Apply filter when SLIDER is dragged (debounced)
    */
   useEffect(() => {
      if (isInitialMount.current) return;

      const value = `${sliderValue[0]}-${sliderValue[1]}`;

      if (lastPriceFilter?.value === value) return;

      // If no filter is active and the slider is at the default [0, 10000],
      // do not unnecessarily add price_range=0-10000 to the URL search params.
      if (!lastPriceFilter?.value && value === "0-10000") return;

      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
         handleFilterChange("price_range", value, true);
      }, debounceTime);

      return () => {
         if (debounceRef.current) clearTimeout(debounceRef.current);
      };
   }, [sliderValue, debounceTime]);

   /**
    * Mark initialization complete AFTER first render
    */
   useEffect(() => {
      isInitialMount.current = false;
   }, []);

   return (
      <div className="flex flex-col gap-5 py-2">
         {/* Preset ranges */}
         <div className="flex flex-col gap-4">
            {filterOptions.priceRanges.map((range) => {
               const value = `${range.min}-${range.max}`;

               return (
                  <div key={range.label} className="flex items-center gap-3 group cursor-pointer">
                     <Checkbox
                        id={`price-${range.label}`}
                        checked={selectedRadio === value}
                        onCheckedChange={(checked) => {
                           if (checked) {
                              setSelectedRadio(value);
                           } else {
                              setSelectedRadio(null);
                              handleFilterChange("price_range", value, false);
                           }
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

         {/* Slider */}
         <div className="flex flex-col gap-3 pt-2">
            <div className="flex justify-between text-xs font-bold text-muted-foreground/80 uppercase tracking-wider">
               <Label className="text-xs font-bold cursor-default">Min: ${sliderValue[0]}</Label>
               <Label className="text-xs font-bold cursor-default">Max: ${sliderValue[1]}</Label>
            </div>

            <Slider
               value={sliderValue}
               min={0}
               max={10000}
               step={50}
               onValueChange={(value) =>
                  setSliderValue(value as [number, number])
               }
            />
         </div>
      </div>
   );
};
