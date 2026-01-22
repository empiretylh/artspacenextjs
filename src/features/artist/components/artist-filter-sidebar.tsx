import React, { useState } from "react";
import { FilterIcon, Search, X, ChevronLeft, ChevronRight } from "lucide-react";
import { filterOptions } from "@/mocks";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FilterSection } from "./artist-filter-section";

export interface Filters {
   price: string[];
   medium: string[];
   style: string[];
}

interface FilterSidebarProps {
   filters: Filters;
   setFilters: React.Dispatch<React.SetStateAction<Filters>>;
   search: string;
   onSearchChange: (value: string) => void;
   isCollapsed: boolean;
   setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
   filters,
   setFilters,
   search,
   onSearchChange,
   isCollapsed,
   setIsCollapsed,
}) => {
   const [openSections, setOpenSections] = useState({
      price: true,
      medium: true,
      style: true,
   });

   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // mobile

   const toggleSection = (section: keyof Filters) => {
      setOpenSections((prev) => ({
         ...prev,
         [section]: !prev[section],
      }));
   };

   const handleFilterChange = (
      key: keyof Filters,
      value: string,
      isChecked: boolean | "indeterminate"
   ) => {
      setFilters((prev) => ({
         ...prev,
         [key]: isChecked
            ? [...prev[key], value]
            : prev[key].filter((item) => item !== value),
      }));
   };

   const clearAllFilters = () => {
      setFilters({ price: [], medium: [], style: [] });
   };

   return (
      <>
         {/* Mobile Top Controls */}
         <div className="lg:hidden flex justify-between">
            <Button
               variant="outline"
               onClick={() => setIsSidebarOpen(true)}
               className="flex items-center gap-2"
            >
               <FilterIcon className="h-5 w-5" />
               Filters
            </Button>
            <div className="relative max-w-xl">
               <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
               <Input
                  type="text"
                  placeholder="Search artworks..."
                  value={search}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="pl-10"
               />
            </div>
         </div>

         {/* Desktop collapse/open button (appears when collapsed) */}

         {/* Sidebar (Desktop + Mobile) */}
         <aside
            className={`
               fixed top-0 right-0 h-full w-80 lg:w-full bg-background shadow-lg border-l border-border
               transform transition-transform duration-300 ease-in-out z-50
               ${isSidebarOpen || isCollapsed ? "translate-x-0" : "translate-x-full"}
               lg:relative lg:translate-x-0 lg:shadow-none lg:border-none
            `}
         >
            <div className="p-4 space-y-4 w-full overflow-y-auto h-[90vh]">
               {/* Header */}
               <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center">
                     <FilterIcon className="h-6 w-6 mr-2 text-primary" />
                     Filters
                  </h2>

                  <div className="flex items-center gap-2">
                     {/* Desktop collapse button */}
                     <button
                        onClick={() => setIsCollapsed(true)}
                        className="hidden lg:block p-2 rounded hover:bg-muted"
                        aria-label="Collapse sidebar"
                     >
                        <ChevronLeft className="h-5 w-5" />
                     </button>

                     {/* Mobile close button */}
                     <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden p-2 rounded hover:bg-muted"
                        aria-label="Close filters"
                     >
                        <X className="h-5 w-5" />
                     </button>
                  </div>
               </div>

               {/* Price Filter */}
               <FilterSection
                  title="Price Range"
                  isOpen={openSections.price}
                  onToggle={() => toggleSection("price")}
               >
                  {filterOptions.priceRanges.map((range) => (
                     <div className="flex gap-3" key={range.label}>
                        <Checkbox
                           id={`price-${range.label}`}
                           checked={filters.price.includes(range.label)}
                           onCheckedChange={(value) =>
                              handleFilterChange("price", range.label, value)
                           }
                        />
                        <Label htmlFor={`price-${range.label}`}>
                           {range.label}
                        </Label>
                     </div>
                  ))}
               </FilterSection>

               {/* Medium Filter */}
               <FilterSection
                  title="Medium"
                  isOpen={openSections.medium}
                  onToggle={() => toggleSection("medium")}
               >
                  {filterOptions.mediums.map((medium) => (
                     <div className="flex gap-3" key={medium}>
                        <Checkbox
                           id={`medium-${medium}`}
                           checked={filters.medium.includes(medium)}
                           onCheckedChange={(value) =>
                              handleFilterChange("medium", medium, value)
                           }
                        />
                        <Label htmlFor={`medium-${medium}`}>{medium}</Label>
                     </div>
                  ))}
               </FilterSection>

               {/* Style Filter */}
               <FilterSection
                  title="Style"
                  isOpen={openSections.style}
                  onToggle={() => toggleSection("style")}
               >
                  {filterOptions.styles.map((style) => (
                     <div className="flex gap-3" key={style}>
                        <Checkbox
                           id={`style-${style}`}
                           checked={filters.style.includes(style)}
                           onCheckedChange={(e) =>
                              handleFilterChange("style", style, e)
                           }
                        />
                        <Label htmlFor={`style-${style}`}>{style}</Label>
                     </div>
                  ))}
               </FilterSection>

               {/* Buttons */}
               <div className="pt-4 space-y-2">
                  <Button className="w-full">Apply Filters</Button>
                  <Button
                     variant="ghost"
                     className="w-full"
                     onClick={clearAllFilters}
                  >
                     Clear All
                  </Button>
               </div>
            </div>
         </aside>

         {/* Mobile overlay background */}
         {isSidebarOpen && (
            <div
               className="fixed inset-0 bg-black/40 z-40 lg:hidden"
               onClick={() => setIsSidebarOpen(false)}
            />
         )}
      </>
   );
};
