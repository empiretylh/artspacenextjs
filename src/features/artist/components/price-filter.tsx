import { useState, useEffect, useRef } from "react";
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
   debounceTime?: number; // in ms
}

export const PriceFilter: React.FC<Props> = ({
   filterOptions,
   filters,
   handleFilterChange,
   debounceTime = 500,
}) => {
   const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
   const [sliderValue, setSliderValue] = useState<[number, number]>([0, 5000]);
   const debounceRef = useRef<NodeJS.Timeout | null>(null);

   // When radio changes, update slider and backend filter immediately
   useEffect(() => {
      if (selectedRadio) {
         const [min, max] = selectedRadio.split("-").map(Number);
         setSliderValue([min, max]);
         handleFilterChange("price_range", selectedRadio, true);
      }
   }, [selectedRadio]);

   // Debounced filter update when dragging slider
   useEffect(() => {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      debounceRef.current = setTimeout(() => {
         handleFilterChange(
            "price_range",
            `${sliderValue[0]}-${sliderValue[1]}`,
            true
         );
      }, debounceTime);

      return () => {
         if (debounceRef.current) clearTimeout(debounceRef.current);
      };
   }, [sliderValue, debounceTime]);

   useEffect(() => {
      filters.forEach((filter) => {
         if (filter.id === "price_range") {
            const values = filter.value?.toString().split("-");
            if (values && values.length === 2) {
               setSelectedRadio(`${values[0]}-${values[1]}`);
            }
         }
      });
   }, [filters]);

   return (
      <div className="flex flex-col py-2 gap-4">
         {/* Radio Select */}
         <div className="flex flex-col gap-2">
            {filterOptions.priceRanges.map((range) => (
               <div className="flex gap-3" key={range.label}>
                  <Checkbox
                     id={`price-${range.label}`}
                     checked={selectedRadio === `${range.min}-${range.max}`}
                     onCheckedChange={(value) => {
                        if (value)
                           setSelectedRadio(`${range.min}-${range.max}`);
                     }}
                  />
                  <Label htmlFor={`price-${range.label}`}>{range.label}</Label>
               </div>
            ))}
         </div>

         {/* Draggable Slider */}
         <div className="flex flex-col gap-2">
            <div className="flex justify-between">
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
