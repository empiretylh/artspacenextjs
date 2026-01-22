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
      return [0, 5000];
   }, [lastPriceFilter]);

   const [sliderValue, setSliderValue] =
      useState<[number, number]>(defaultSliderValue);

   const [selectedRadio, setSelectedRadio] = useState<string | null>(null);

   /**
    * Sync internal state FROM external filters
    * (does NOT trigger filter updates)
    */
   useEffect(() => {
      if (!lastPriceFilter?.value) return;

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
      <div className="flex flex-col gap-4 py-2">
         {/* Preset ranges */}
         <div className="flex flex-col gap-2">
            {filterOptions.priceRanges.map((range) => {
               const value = `${range.min}-${range.max}`;

               return (
                  <div key={range.label} className="flex gap-3">
                     <Checkbox
                        id={`price-${range.label}`}
                        checked={selectedRadio === value}
                        onCheckedChange={(checked) => {
                           if (checked) setSelectedRadio(value);
                        }}
                     />
                     <Label htmlFor={`price-${range.label}`}>
                        {range.label}
                     </Label>
                  </div>
               );
            })}
         </div>

         {/* Slider */}
         <div className="flex flex-col gap-2">
            <div className="flex justify-between text-sm">
               <Label>Min: ${sliderValue[0]}</Label>
               <Label>Max: ${sliderValue[1]}</Label>
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
