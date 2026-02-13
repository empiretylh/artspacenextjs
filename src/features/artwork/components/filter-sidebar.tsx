import React, { useState } from "react";
import { FilterIcon } from "lucide-react";
import { FilterSection } from "./filter-section";
import { filterOptions } from "@/mocks";
import { Checkbox } from "@/components/ui/checkbox";
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
      style: true,
      year: true,
      status: true,
      medium: true,
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
      console.log('this is working')
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
      console.log('this is working 2')
      setFilters((prev) => {
         if (checked) {
            const without = prev.filter((f) => {
               if (f.id === id) return false;
               return true;
            });
            return [...without, { id, value }];
         } else {
            return prev.filter((f) => !(f.id === id && f.value === value));
         }
      });
   };

   return (
      <>
         <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetContent>
               <SheetHeader className="sr-only">
                  <SheetTitle>Edit Filter</SheetTitle>
                  <SheetDescription>
                     Make changes to your filter here.
                  </SheetDescription>
               </SheetHeader>
               <aside
                  className={`
          w-full bg-background`}
               >
                  <ScrollArea className="h-screen">
                     <div className="p-4 w-full">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                           <h2 className="text-2xl font-bold flex items-center">
                              <FilterIcon className="h-6 w-6 mr-2 text-primary" />
                              Filters
                           </h2>

                           {/* <div className="flex items-center gap-2">
                              <button
                                 onClick={() => setIsSidebarOpen(false)}
                                 className="lg:hidden rounded hover:bg-muted"
                                 aria-label="Close filters"
                              >
                                 <X className="h-5 w-5" />
                              </button>
                           </div> */}
                        </div>

                        {/* Price Filter */}
                        {/* <FilterSection
                  title="Price Range"
                  isOpen={openSections.price}
                  onToggle={() => toggleSection("price")}
               >
                  {filterOptions.priceRanges.map((range) => (
                     <div className="flex gap-3" key={range.label}>
                        <Checkbox
                           id={`price-${range.label}`}
                           checked={filters.some(
                              (f) =>
                                 f.id === "price_range" &&
                                 f.value === `${range.min}-${range.max}`
                           )}
                           onCheckedChange={(value) => {
                              handleFilterChange(
                                 "price_range",
                                 `${range.min}-${range.max}`,
                                 !!value
                              );
                           }}
                        />
                        <Label htmlFor={`price-${range.label}`}>
                           {range.label}
                        </Label>
                     </div>
                  ))}
               </FilterSection> */}

                        <FilterSection
                           title="Price Range"
                           isOpen={openSections.price}
                           onToggle={() => toggleSection("price")}
                        >
                           <PriceFilter
                              filterOptions={filterOptions} // your mock filter options
                              filters={filters}
                              handleFilterChange={handlePriceFilterChange}
                              debounceTime={500} // optional, default 500ms
                           />
                        </FilterSection>

                        {/* Category Filter */}
                        <FilterSection
                           title="Category"
                           isOpen={openSections.category}
                           onToggle={() => toggleSection("category")}
                        >
                           {categories.map((category) => (
                              <div className="flex gap-3" key={category.slug}>
                                 <Checkbox
                                    id={`category-${category.slug}`}
                                    checked={filters.some(
                                       (f) =>
                                          f.id === "category" &&
                                          String(f.value) ===
                                          String(category.slug)
                                    )}
                                    onCheckedChange={(value) =>
                                       handleFilterChange(
                                          "category",
                                          category.slug,
                                          !!value
                                       )
                                    }
                                 />
                                 <Label htmlFor={`category-${category.slug}`}>
                                    {category.name}
                                 </Label>
                              </div>
                           ))}
                        </FilterSection>

                        {/* Style Filter */}
                        {/* <FilterSection
                           title="Style"
                           isOpen={openSections.style}
                           onToggle={() => toggleSection("style")}
                        >
                           {filterOptions.styles.map((style) => (
                              <div className="flex gap-3" key={style}>
                                 <Checkbox
                                    id={`style-${style}`}
                                    checked={filters.some(
                                       (f) =>
                                          f.id === "style" && f.value === style
                                    )}
                                    onCheckedChange={(value) =>
                                       handleFilterChange(
                                          "style",
                                          style,
                                          !!value
                                       )
                                    }
                                 />
                                 <Label htmlFor={`style-${style}`}>
                                    {style}
                                 </Label>
                              </div>
                           ))}
                        </FilterSection> */}

                        {/* Year Filter */}
                        {/* <FilterSection
                           title="Year"
                           isOpen={openSections.year}
                           onToggle={() => toggleSection("year")}
                        >
                           {filterOptions.years.map((year) => (
                              <div className="flex gap-3" key={year}>
                                 <Checkbox
                                    id={`year-${year}`}
                                    checked={filters.some(
                                       (f) =>
                                          f.id === "year" && f.value === year
                                    )}
                                    onCheckedChange={(value) =>
                                       handleFilterChange("year", year, !!value)
                                    }
                                 />
                                 <Label htmlFor={`year-${year}`}>{year}</Label>
                              </div>
                           ))}
                        </FilterSection> */}

                        {/* Status Filter */}
                        {/* <FilterSection
                           title="Status"
                           isOpen={openSections.status}
                           onToggle={() => toggleSection("status")}
                        >
                           {filterOptions.status.map((status) => (
                              <div className="flex gap-3" key={status}>
                                 <Checkbox
                                    id={`status-${status}`}
                                    checked={filters.some(
                                       (f) =>
                                          f.id === "status" &&
                                          f.value === status
                                    )}
                                    onCheckedChange={(value) =>
                                       handleFilterChange(
                                          "status",
                                          status,
                                          !!value
                                       )
                                    }
                                 />
                                 <Label htmlFor={`status-${status}`}>
                                    {status}
                                 </Label>
                              </div>
                           ))}
                        </FilterSection> */}

                        {/* Medium Filter */}
                        {/* <FilterSection
                           title="Medium"
                           isOpen={openSections.medium}
                           onToggle={() => toggleSection("medium")}
                        >
                           {filterOptions.mediums.map((medium) => (
                              <div className="flex gap-3" key={medium}>
                                 <Checkbox
                                    id={`medium-${medium}`}
                                    checked={filters.some(
                                       (f) =>
                                          f.id === "medium" &&
                                          f.value === medium
                                    )}
                                    onCheckedChange={(value) =>
                                       handleFilterChange(
                                          "medium",
                                          medium,
                                          !!value
                                       )
                                    }
                                 />
                                 <Label htmlFor={`medium-${medium}`}>
                                    {medium}
                                 </Label>
                              </div>
                           ))}
                        </FilterSection> */}
                     </div>
                  </ScrollArea>
               </aside>
            </SheetContent>
         </Sheet>
         {/* Sidebar */}
      </>
   );
};
