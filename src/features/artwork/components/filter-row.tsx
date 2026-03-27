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
import { FilterRowSkeleton } from "@/components/app/filter-row-skeleton";
import { useGetCategories } from "@/features/service/artspace/get-categories";
import { useGetGenres } from "@/features/service/artspace/get-genres";
import { useGetStyles } from "@/features/service/artspace/get-styles";
import { cn } from "@/lib/utils";

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

   const genreQuery = useGetGenres();
   const genres = genreQuery.data?.data || [];

   const styleQuery = useGetStyles();
   const styles = styleQuery.data?.data || [];

   // generic handler for ALL selects
   const handleSelectChange = (id: string, value: string) => {
      setFilters((prev) => {
         const without = prev.filter((f) => {
            if (f.id === id) {
               return String(f.value) !== String(value);
            } else return true;
         });
         return [...without, { id, value }];
      });
   };

   const getSelected = (id: string, value: string) => {
      const filter = filters.filter((f) => {
         return f.id === id;
      });
      if (!filter) return false;
      return filter.some((f) => String(f.value) === String(value));
   }

   if (categoryQuery.isLoading || genreQuery.isLoading || styleQuery.isLoading)
      return <FilterRowSkeleton />;

   return (
      <ScrollArea>
         <div className="py-2 flex gap-2">
            {/* CATEGORY — API BASED */}
            <div>
               <Select
                  value={""}
                  onValueChange={(v) => handleSelectChange("category", v)}
               >
                  <SelectTrigger
                     className="w-auto max-w-full rounded-xl"
                     data-testid="artworks-filter-category"
                  >
                     <SelectValue placeholder="Category" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup className="space-y-1">
                        <SelectLabel>Categories</SelectLabel>

                        {categories.map((category) => (
                           <SelectItem
                              key={category.id}
                              value={String(category.slug)}
                              className={cn(getSelected("category", category.slug) && "bg-primary! text-primary-foreground!")}
                           >
                              {category.name}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>

            <div>
               <Select
                  value={""}
                  onValueChange={(v) => handleSelectChange("genre", v)}
               >
                  <SelectTrigger
                     className="w-auto max-w-full rounded-xl"
                     data-testid="artworks-filter-genre"
                  >
                     <SelectValue placeholder="Genre" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup>
                        <SelectLabel>Genres</SelectLabel>

                        {genres.map((genre) => (
                           <SelectItem
                              key={genre.id}
                              value={String(genre.slug)}
                              className={cn(getSelected("genre", genre.slug) && "bg-primary! text-primary-foreground!")}
                           >
                              {genre.name}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>

            <div>
               <Select
                  value={""}
                  onValueChange={(v) => handleSelectChange("art-style", v)}
               >
                  <SelectTrigger
                     className="w-auto max-w-full rounded-xl"
                     data-testid="artworks-filter-style"
                  >
                     <SelectValue placeholder="Style" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup>
                        <SelectLabel>Styles</SelectLabel>

                        {styles.map((style) => (
                           <SelectItem
                              key={style.id}
                              value={String(style.slug)}
                           >
                              {style.name}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div>

            {/* STYLE */}
            {/* <div>
               <Select
                  value=""
                  onValueChange={(v) => handleSelectChange("style", v)}
               >
                  <SelectTrigger className="w-auto max-w-full rounded-xl">
                     <SelectValue placeholder="Style" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup>
                        <SelectLabel>Styles</SelectLabel>
                        {dummyStyle.map((item) => (
                           <SelectItem key={item} value={item}>
                              {item}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div> */}

            {/* MATERIAL */}
            {/* <div>
               <Select
                  value={getSelected("material")}
                  onValueChange={(v) => handleSelectChange("material", v)}
               >
                  <SelectTrigger className="w-auto max-w-full rounded-xl">
                     <SelectValue placeholder="material" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup>
                        <SelectLabel>Materials</SelectLabel>
                        {dummyMaterial.map((item) => (
                           <SelectItem key={item} value={item}>
                              {item}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div> */}

            {/* BASE */}
            {/* <div>
               <Select
                  value={getSelected("base")}
                  onValueChange={(v) => handleSelectChange("base", v)}
               >
                  <SelectTrigger className="w-auto max-w-full rounded-xl">
                     <SelectValue placeholder="base" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup>
                        <SelectLabel>Bases</SelectLabel>
                        {dummyBase.map((item) => (
                           <SelectItem key={item} value={item}>
                              {item}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div> */}

            {/* COUNTRY */}
            {/* <div>
               <Select
                  value={getSelected("country")}
                  onValueChange={(v) => handleSelectChange("country", v)}
               >
                  <SelectTrigger className="w-auto max-w-full rounded-xl">
                     <SelectValue placeholder="country" />
                  </SelectTrigger>

                  <SelectContent className="rounded-xl max-h-[300px]">
                     <SelectGroup>
                        <SelectLabel>Countries</SelectLabel>
                        {dummyCountry.map((item) => (
                           <SelectItem key={item} value={item}>
                              {item}
                           </SelectItem>
                        ))}
                     </SelectGroup>
                  </SelectContent>
               </Select>
            </div> */}
         </div>
         <ScrollBar orientation="horizontal" />
      </ScrollArea>
   );
};
