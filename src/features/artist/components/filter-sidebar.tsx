import React, { useState } from "react";
import { FilterIcon, X, ChevronLeft } from "lucide-react";
import { FilterSection } from "./filter-section";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { ColumnFiltersState } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGetCategories } from "@/features/service/artspace/get-categories";

interface FilterSidebarProps {
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
   search: string;
   onSearchChange: (value: string) => void;
   isCollapsed: boolean;
   setIsCollapsed: React.Dispatch<React.SetStateAction<boolean>>;
   isSidebarOpen?: boolean;
   setIsSidebarOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
   filters,
   setFilters,
   isCollapsed,
   setIsCollapsed,
   isSidebarOpen = false,
   setIsSidebarOpen = () => {},
}) => {
   const [openSections, setOpenSections] = useState({
      category: true,
   });
   const categoryQuery = useGetCategories();
   const categories = categoryQuery.data?.data || [];

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
            return [...prev, { id, value }];
         } else {
            return prev.filter((f) => !(f.id === id && f.value === value));
         }
      });
   };

   return (
      <>
         {/* Sidebar */}
         <aside
            className={`
          fixed top-0 right-0 h-full w-80 lg:w-full bg-background shadow-lg border-l border-border
          transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen || isCollapsed ? "translate-x-0" : "translate-x-full"}
          lg:relative lg:translate-x-0 lg:shadow-none lg:border-none
        `}
         >
            <ScrollArea className="h-screen">
               <div className="p-4 space-y-4 w-full">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                     <h2 className="text-2xl font-bold flex items-center">
                        <FilterIcon className="h-6 w-6 mr-2 text-primary" />
                        Filters
                     </h2>

                     <div className="flex items-center gap-2">
                        <button
                           onClick={() => setIsCollapsed(true)}
                           className="hidden lg:block rounded hover:bg-muted"
                           aria-label="Collapse sidebar"
                        >
                           <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                           onClick={() => setIsSidebarOpen(false)}
                           className="lg:hidden rounded hover:bg-muted"
                           aria-label="Close filters"
                        >
                           <X className="h-5 w-5" />
                        </button>
                     </div>
                  </div>
                  {/* Category Filter */}
                  <FilterSection
                     title="Category"
                     isOpen={openSections.category}
                     onToggle={() => toggleSection("category")}
                  >
                     {categories.map((category) => (
                        <div className="flex gap-3" key={category.id}>
                           <Checkbox
                              id={`category-${category.id}`}
                              checked={filters.some(
                                 (f) =>
                                    f.id === "category" &&
                                    f.value === category.id
                              )}
                              onCheckedChange={(value) =>
                                 handleFilterChange(
                                    "category",
                                    category.id,
                                    !!value
                                 )
                              }
                           />
                           <Label htmlFor={`category-${category.id}`}>
                              {category.name}
                           </Label>
                        </div>
                     ))}
                  </FilterSection>
               </div>
            </ScrollArea>
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
