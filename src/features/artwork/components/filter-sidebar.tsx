'use client'
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FilterIcon } from "lucide-react";
import { FilterSection } from "./filter-section";
import { filterOptions } from "@/mocks";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { ColumnFiltersState } from "@/types";
import { PriceFilter } from "./price-filter";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
   Sheet,
   SheetContent,
   SheetDescription,
   SheetHeader,
   SheetTitle,
} from "@/components/ui/sheet";
import { useGetCategories } from "@/features/service/artspace/get-categories";
import { useGetGenres } from "@/features/service/artspace/get-genres";
import { useGetStyles } from "@/features/service/artspace/get-styles";

interface FilterSidebarProps {
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
   isSidebarOpen?: boolean;
   setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
   filters,
   setFilters,
   isSidebarOpen = false,
   setIsSidebarOpen = () => { },
}) => {
   const [openSections, setOpenSections] = useState({
      price: true,
      category: true,
      genre: true,
      style: true,
      year: true,
      status: true,
      medium: true,
   });
   
   const categoryQuery = useGetCategories();
   const categories = categoryQuery.data?.data || [];

   const genreQuery = useGetGenres();
   const genres = genreQuery.data?.data || [];

   const styleQuery = useGetStyles();
   const styles = styleQuery.data?.data || [];

   const toggleSection = (section: keyof typeof openSections) => {
      setOpenSections((prev) => ({
         ...prev,
         [section]: !prev[section],
      }));
   };

   const handleFilterChange = (
      id: string,
      value: string | number,
      checked: boolean
   ) => {
      setFilters((prev) => {
         if (checked) {
            const without = prev.filter((f) => {
               if (f.id === id) {
                  return String(f.value) !== String(value);
               } else return true;
            });
            return [...without, { id, value }];
         } else {
            return prev.filter((f) => !(f.id === id && f.value === value));
         }
      });
   };

   const handlePriceFilterChange = (
      id: string,
      value: string | number,
      checked: boolean
   ) => {
      setFilters((prev) => {
         if (checked) {
            const without = prev.filter((f) => f.id !== id);
            if (value === "0-10000") {
               return without;
            }
            return [...without, { id, value }];
         } else {
            return prev.filter((f) => f.id !== id);
         }
      });
   };

   return (
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
         <SheetContent className="w-full sm:max-w-md p-0 border-none bg-background shadow-2xl flex flex-col h-full">
            <SheetHeader className="p-6 border-b border-border/50 flex-none">
               <div className="flex items-center justify-between">
                  <div className="space-y-1">
                     <SheetTitle className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
                        <FilterIcon className="size-5 text-primary" />
                        Refine Search
                     </SheetTitle>
                     <SheetDescription className="text-xs font-medium uppercase tracking-widest text-muted-foreground/70">
                        Customize your discovery
                     </SheetDescription>
                  </div>
               </div>
            </SheetHeader>

            <ScrollArea className="flex-grow h-0 px-6">
               <div className="flex flex-col gap-2">
                  {/* Price Filter */}
                  <FilterSection
                     title="Value Range"
                     isOpen={openSections.price}
                     onToggle={() => toggleSection("price")}
                  >
                     <div className="pt-2">
                        <PriceFilter
                           filterOptions={filterOptions}
                           filters={filters}
                           handleFilterChange={handlePriceFilterChange}
                        />
                     </div>
                  </FilterSection>

                  {/* Status Filter */}
                  <FilterSection
                     title="Availability"
                     isOpen={openSections.status}
                     onToggle={() => toggleSection("status")}
                  >
                     <RadioGroup
                        value={filters.find(f => f.id === "status")?.value as string || "ALL"}
                        onValueChange={(val) => {
                           if (val === "ALL") {
                              setFilters(prev => prev.filter(f => f.id !== "status"));
                           } else {
                              setFilters(prev => [
                                 ...prev.filter(f => f.id !== "status"),
                                 { id: "status", value: val }
                              ]);
                           }
                        }}
                        className="grid grid-cols-1 gap-4 pt-1"
                     >
                        <div className="flex items-center gap-3 group cursor-pointer">
                           <RadioGroupItem value="ALL" id="status-all" className="size-5 border-muted-foreground/30 focus:border-primary" />
                           <Label htmlFor="status-all" className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors">
                              Show All Artworks
                           </Label>
                        </div>
                        {filterOptions.status.map((status) => (
                           <div className="flex items-center gap-3 group cursor-pointer" key={status}>
                              <RadioGroupItem value={status} id={`status-${status}`} className="size-5 border-muted-foreground/30 focus:border-primary" />
                              <Label
                                 htmlFor={`status-${status}`}
                                 className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors"
                              >
                                 {status === "AVAILABLE" ? "Available Now" :
                                    status === "SOLD" ? "Recently Sold" :
                                       status === "NOT_FOR_SALE" ? "Exhibition Only" :
                                          status === "SOLD_OUT" ? "Sold Out" : status}
                              </Label>
                           </div>
                        ))}
                     </RadioGroup>
                  </FilterSection>

                  {/* Category Filter */}
                  <FilterSection
                     title="Art Forms"
                     isOpen={openSections.category}
                     onToggle={() => toggleSection("category")}
                  >
                     <div className="grid grid-cols-1 gap-y-4 pt-1">
                        {categories.map((category) => (
                           <div className="flex items-center gap-3 group cursor-pointer" key={category.slug}>
                              <Checkbox
                                 id={`category-${category.slug}`}
                                 checked={filters.some(
                                    (f) =>
                                       f.id === "category" &&
                                       String(f.value) === String(category.slug)
                                 )}
                                 onCheckedChange={(value) =>
                                    handleFilterChange(
                                       "category",
                                       category.slug,
                                       !!value
                                    )
                                 }
                                 className="size-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <Label
                                 htmlFor={`category-${category.slug}`}
                                 className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors"
                              >
                                 {category.name}
                              </Label>
                           </div>
                        ))}
                     </div>
                  </FilterSection>

                  {/* Genre Filter */}
                  <FilterSection
                     title="Art Genres"
                     isOpen={openSections.genre}
                     onToggle={() => toggleSection("genre")}
                  >
                     <div className="grid grid-cols-1 gap-y-4 pt-1">
                        {genres.map((genre) => (
                           <div className="flex items-center gap-3 group cursor-pointer" key={genre.slug}>
                              <Checkbox
                                 id={`genre-${genre.slug}`}
                                 checked={filters.some(
                                    (f) =>
                                       f.id === "genre" &&
                                       String(f.value) === String(genre.slug)
                                 )}
                                 onCheckedChange={(value) =>
                                    handleFilterChange(
                                       "genre",
                                       genre.slug,
                                       !!value
                                    )
                                 }
                                 className="size-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <Label
                                 htmlFor={`genre-${genre.slug}`}
                                 className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors"
                              >
                                 {genre.name}
                              </Label>
                           </div>
                        ))}
                     </div>
                  </FilterSection>

                  {/* Style Filter */}
                  <FilterSection
                     title="Art Styles"
                     isOpen={openSections.style}
                     onToggle={() => toggleSection("style")}
                  >
                     <div className="grid grid-cols-1 gap-y-4 pt-1">
                        {styles.map((style) => (
                           <div className="flex items-center gap-3 group cursor-pointer" key={style.slug}>
                              <Checkbox
                                 id={`style-${style.slug}`}
                                 checked={filters.some(
                                    (f) =>
                                       f.id === "style" &&
                                       String(f.value) === String(style.slug)
                                 )}
                                 onCheckedChange={(value) =>
                                    handleFilterChange(
                                       "style",
                                       style.slug,
                                       !!value
                                    )
                                 }
                                 className="size-5 rounded-md border-muted-foreground/30 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                              />
                              <Label
                                 htmlFor={`style-${style.slug}`}
                                 className="text-sm font-semibold cursor-pointer group-hover:text-primary transition-colors"
                              >
                                 {style.name}
                              </Label>
                           </div>
                        ))}
                     </div>
                  </FilterSection>
               </div>
               <div className="h-10" /> {/* Extra padding at bottom for scroll */}
            </ScrollArea>

            <div className="p-6 border-t border-border/50 bg-background/80 backdrop-blur-md flex-none flex gap-3">
               <Button
                  className="flex-1 rounded-full h-12 font-bold shadow-lg shadow-primary/20"
                  onClick={() => setIsSidebarOpen(false)}
               >
                  Show Results
               </Button>
               <Button
                  variant="outline"
                  className="rounded-full h-12 px-6 font-bold"
                  onClick={() => setFilters([])}
               >
                  Reset
               </Button>
            </div>
         </SheetContent>
      </Sheet>
   );
};
