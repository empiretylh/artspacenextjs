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
import { useGetCategories } from "@/features/service/artspace/get-categories";

interface FilterRowProps {
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export const FilterRow: React.FC<FilterRowProps> = ({
   filters,
   setFilters,
}) => {
   // ---------------------------
   // CATEGORY (LIVE API)
   // ---------------------------
   const categoryQuery = useGetCategories();
   const categories = categoryQuery.data?.data || [];

   const handleCategoryChange = (value: string) => {
      const categoryId = Number(value);

      setFilters((prev) => {
         const withoutCategory = prev.filter((f) => f.id !== "category");
         return [...withoutCategory, { id: "category", value: categoryId }];
      });
   };

   const selectedCategory = filters.find((f) => f.id === "category")?.value;
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
