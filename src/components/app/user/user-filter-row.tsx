import React from "react";
import type { ColumnFiltersState } from "@/types";
import {
   Select,
   SelectTrigger,
   SelectContent,
   SelectGroup,
   SelectLabel,
   SelectItem,
   SelectValue,
} from "@/components/ui/select";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

interface FilterRowProps {
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export const FilterRow: React.FC<FilterRowProps> = ({
   filters,
   setFilters,
}) => {
   const dummyCountry = ["USA", "France", "Italy", "Japan"];

   // generic handler for ALL selects
   const handleSelectChange = (id: string, value: string) => {
      setFilters((prev) => {
         const without = prev.filter((f) => f.id !== id);
         return [...without, { id, value }];
      });
   };

   const getSelected = (id: string) =>
      filters.find((f) => f.id === id)?.value as string | undefined;

   return (
      <ScrollArea>
         <div className="py-2 flex gap-2">
            {/* COUNTRY */}
            <div>
               <Select
                  value={getSelected("country")}
                  onValueChange={(v) => handleSelectChange("country", v)}
               >
                  <SelectTrigger className="w-auto max-w-full rounded-xl">
                     <SelectValue placeholder="country" />
                  </SelectTrigger>

                  <SelectContent>
                     <SelectGroup>
                        <SelectLabel>Countrys</SelectLabel>
                        {dummyCountry.map((item) => (
                           <SelectItem key={item} value={item}>
                              {item}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>
         </div>
         <ScrollBar orientation="horizontal" />
      </ScrollArea>
   );
};
