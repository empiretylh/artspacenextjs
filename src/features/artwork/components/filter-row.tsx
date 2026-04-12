'use client'
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
   Select,
   SelectContent,
   SelectGroup,
   SelectItem,
   SelectLabel,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useGetCategories } from "@/features/service/artspace/get-categories";
import { useGetGenres } from "@/features/service/artspace/get-genres";
import { useGetStyles } from "@/features/service/artspace/get-styles";
import { cn } from "@/lib/utils";
import type { ColumnFiltersState } from "@/types";

interface FilterRowProps {
   filters: ColumnFiltersState;
   setFilters: React.Dispatch<React.SetStateAction<ColumnFiltersState>>;
}

export const FilterRow = ({ filters, setFilters }: FilterRowProps) => {
   const categoriesQuery = useGetCategories();
   const genresQuery = useGetGenres();
   const stylesQuery = useGetStyles();

   const categories = categoriesQuery.data?.data || [];
   const genres = genresQuery.data?.data || [];
   const styles = stylesQuery.data?.data || [];

   const handleSelectChange = (id: string, value: string) => {
      setFilters((prev) => {
         if (id === "status" || id === "price_range" || id === "category" || id === "genre" || id === "style") {
            if (value === "ALL" || value === "") {
               return prev.filter(f => f.id !== id);
            }
            return [...prev.filter(f => f.id !== id), { id, value }];
         }

         const without = prev.filter((f) => {
            if (f.id === id) {
               return String(f.value) !== String(value);
            } else return true;
         });
         return [...without, { id, value }];
      });
   };

   const getFilterValue = (id: string) => {
      return filters.find(f => f.id === id)?.value as string || "";
   }

   // High-Contrast Premium pill styles
   const activeFilterClass = "bg-primary text-primary-foreground hover:bg-primary/95 hover:text-primary-foreground shadow-md ring-1 ring-primary/20 scale-[1.02] transition-transform";
   const inactiveFilterClass = "bg-white border-2 border-muted/70 shadow-sm hover:border-primary/30 hover:bg-muted/10 transition-all";

   return (
      <div className="w-full mb-6">
         <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex w-max items-center space-x-3 py-2 px-1">
               {/* QUICK TOGGLE — AVAILABLE */}
               <Button
                  variant="outline"
                  size="sm"
                  className={cn(
                     "rounded-full h-10 px-6 font-bold transition-all duration-300",
                     getFilterValue("status") === "AVAILABLE" ? activeFilterClass : inactiveFilterClass
                  )}
                  onClick={() => {
                     if (getFilterValue("status") === "AVAILABLE") {
                        setFilters(prev => prev.filter(f => f.id !== "status"));
                     } else {
                        setFilters(prev => [...prev.filter(f => f.id !== "status"), { id: "status", value: "AVAILABLE" }]);
                     }
                  }}
               >
                  Available
               </Button>

               {/* STATUS SELECT */}
               <div>
                  <Select
                     value={getFilterValue("status")}
                     onValueChange={(v) => handleSelectChange("status", v)}
                  >
                     <SelectTrigger
                        className={cn(
                           "w-auto h-10 min-w-[120px] rounded-full px-5 font-bold transition-all duration-300",
                           getFilterValue("status") && getFilterValue("status") !== "ALL" ? activeFilterClass : inactiveFilterClass
                        )}
                     >
                        <SelectValue placeholder="Status" />
                     </SelectTrigger>

                     <SelectContent className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                        <SelectGroup>
                           <SelectLabel className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Search Status</SelectLabel>
                           <SelectItem value="ALL" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">All Statuses</SelectItem>
                           {["AVAILABLE", "SOLD", "NOT_FOR_SALE", "SOLD_OUT"].map((s) => (
                              <SelectItem
                                 key={s}
                                 value={s}
                                 className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5"
                              >
                                 {s === "AVAILABLE" ? "Available" :
                                    s === "SOLD" ? "Sold" :
                                       s === "NOT_FOR_SALE" ? "Not for Sale" :
                                          s === "SOLD_OUT" ? "Sold Out" : s}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>

               {/* CATEGORY SELECT */}
               <div>
                  <Select
                     value={getFilterValue("category")}
                     onValueChange={(v) => handleSelectChange("category", v)}
                  >
                     <SelectTrigger
                        className={cn(
                           "w-auto h-10 min-w-[130px] rounded-full px-5 font-bold transition-all duration-300",
                           getFilterValue("category") && getFilterValue("category") !== "ALL" ? activeFilterClass : inactiveFilterClass
                        )}
                     >
                        <SelectValue placeholder="Category" />
                     </SelectTrigger>

                     <SelectContent className="rounded-2xl border-none shadow-2xl p-2 min-w-[220px]">
                        <SelectGroup>
                           <SelectLabel className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Categories</SelectLabel>
                           <SelectItem value="ALL" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">All Categories</SelectItem>
                           {categories.map((c: any) => (
                              <SelectItem key={c.id} value={c.slug} className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                 {c.name}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>

               {/* GENRE SELECT */}
               <div>
                  <Select
                     value={getFilterValue("genre")}
                     onValueChange={(v) => handleSelectChange("genre", v)}
                  >
                     <SelectTrigger
                        className={cn(
                           "w-auto h-10 min-w-[120px] rounded-full px-5 font-bold transition-all duration-300",
                           getFilterValue("genre") && getFilterValue("genre") !== "ALL" ? activeFilterClass : inactiveFilterClass
                        )}
                     >
                        <SelectValue placeholder="Genre" />
                     </SelectTrigger>

                     <SelectContent className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                        <SelectGroup>
                           <SelectLabel className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Genres</SelectLabel>
                           <SelectItem value="ALL" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">All Genres</SelectItem>
                           {genres.map((g: any) => (
                              <SelectItem key={g.id} value={g.slug} className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                 {g.name}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>

               {/* STYLE SELECT */}
               <div>
                  <Select
                     value={getFilterValue("style")}
                     onValueChange={(v) => handleSelectChange("style", v)}
                  >
                     <SelectTrigger
                        className={cn(
                           "w-auto h-10 min-w-[120px] rounded-full px-5 font-bold transition-all duration-300",
                           getFilterValue("style") && getFilterValue("style") !== "ALL" ? activeFilterClass : inactiveFilterClass
                        )}
                     >
                        <SelectValue placeholder="Style" />
                     </SelectTrigger>

                     <SelectContent className="rounded-2xl border-none shadow-2xl p-2 min-w-[200px]">
                        <SelectGroup>
                           <SelectLabel className="px-4 py-2.5 text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">Styles</SelectLabel>
                           <SelectItem value="ALL" className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">All Styles</SelectItem>
                           {styles.map((s: any) => (
                              <SelectItem key={s.id} value={s.slug} className="rounded-xl focus:bg-primary focus:text-primary-foreground cursor-pointer py-2.5">
                                 {s.name}
                              </SelectItem>
                           ))}
                        </SelectGroup>
                     </SelectContent>
                  </Select>
               </div>
            </div>
            <ScrollBar orientation="horizontal" className="hidden" />
         </ScrollArea>
      </div>
   );
};
