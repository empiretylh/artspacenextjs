"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Search, X, ArrowUpDown, Globe } from "lucide-react";
import type { BlogCategory, BlogLanguage, BlogTag } from "@/types";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface BlogFilterBarProps {
   categories: BlogCategory[];
   tags?: BlogTag[];
   selectedCategory?: string;
   selectedTag?: string;
   selectedLanguage?: string;
   selectedOrdering?: string;
   searchQuery?: string;
   onCategoryChange: (categorySlug: string | undefined) => void;
   onTagChange: (tagSlug: string | undefined) => void;
   onLanguageChange: (lang: BlogLanguage | undefined) => void;
   onOrderingChange: (ordering: string) => void;
   onSearchChange: (query: string) => void;
   onClearFilters: () => void;
}

export const BlogFilterBar: React.FC<BlogFilterBarProps> = ({
   categories,
   tags = [],
   selectedCategory,
   selectedTag,
   selectedLanguage,
   selectedOrdering = "-published_at",
   searchQuery = "",
   onCategoryChange,
   onTagChange,
   onLanguageChange,
   onOrderingChange,
   onSearchChange,
   onClearFilters,
}) => {
   const t = useTranslations("Blog");
   const [localSearch, setLocalSearch] = useState(searchQuery);

   useEffect(() => {
      setLocalSearch(searchQuery);
   }, [searchQuery]);

   const handleSearchSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearchChange(localSearch.trim());
   };

   const hasActiveFilters = Boolean(
      selectedCategory ||
      selectedTag ||
      selectedLanguage ||
      searchQuery ||
      selectedOrdering !== "-published_at"
   );

   return (
      <div className="space-y-3 mb-6">
         {/* Top Bar: Search, Language, Sort */}
         <div className="flex flex-col sm:flex-row gap-2.5 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
               <Input
                  type="search"
                  placeholder={t("searchPlaceholder")}
                  value={localSearch}
                  onChange={(e) => {
                     setLocalSearch(e.target.value);
                     if (e.target.value === "") {
                        onSearchChange("");
                     }
                  }}
                  className="pl-9 pr-8 h-9 rounded-full bg-card border-border/80 text-xs sm:text-sm focus-visible:ring-primary/20"
               />
               {localSearch && (
                  <button
                     type="button"
                     onClick={() => {
                        setLocalSearch("");
                        onSearchChange("");
                     }}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                     <X className="w-3.5 h-3.5" />
                  </button>
               )}
            </form>

            {/* Selectors */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
               {/* Language Selector */}
               <Select
                  value={selectedLanguage || "all"}
                  onValueChange={(val) =>
                     onLanguageChange(val === "all" ? undefined : (val as BlogLanguage))
                  }
               >
                  <SelectTrigger className="h-9 rounded-full text-xs font-medium px-3 gap-1.5 border-border/80 bg-card min-w-[125px]">
                     <Globe className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                     <SelectValue placeholder={t("allLanguages")} />
                  </SelectTrigger>
                  <SelectContent align="end">
                     <SelectItem value="all">{t("allLanguages")}</SelectItem>
                     <SelectItem value="en">English (EN)</SelectItem>
                     <SelectItem value="my">မြန်မာစာ (MY)</SelectItem>
                  </SelectContent>
               </Select>

               {/* Sort Ordering */}
               <Select
                  value={selectedOrdering}
                  onValueChange={(val) => onOrderingChange(val)}
               >
                  <SelectTrigger className="h-9 rounded-full text-xs font-medium px-3 gap-1.5 border-border/80 bg-card min-w-[130px]">
                     <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                     <SelectValue placeholder={t("sortBy")} />
                  </SelectTrigger>
                  <SelectContent align="end">
                     <SelectItem value="-published_at">{t("sortNewest")}</SelectItem>
                     <SelectItem value="published_at">{t("sortOldest")}</SelectItem>
                     <SelectItem value="title">{t("sortTitleAsc")}</SelectItem>
                     <SelectItem value="-title">{t("sortTitleDesc")}</SelectItem>
                  </SelectContent>
               </Select>

               {/* Reset Button if active */}
               {hasActiveFilters && (
                  <Button
                     variant="ghost"
                     size="sm"
                     onClick={onClearFilters}
                     className="h-9 rounded-full text-xs font-medium text-muted-foreground hover:text-foreground shrink-0 px-2.5"
                  >
                     <X className="w-3.5 h-3.5 mr-1" />
                     {t("reset")}
                  </Button>
               )}
            </div>
         </div>

         {/* Category Pills */}
         <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
            <button
               type="button"
               onClick={() => onCategoryChange(undefined)}
               className={cn(
                  "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 cursor-pointer shadow-2xs h-8 flex items-center",
                  !selectedCategory
                     ? "bg-primary text-primary-foreground shadow-xs"
                     : "bg-card hover:bg-muted/70 text-foreground border border-border/70"
               )}
            >
               {t("allCategories")}
            </button>

            {categories.map((cat) => {
               const isActive = selectedCategory === cat.slug;
               return (
                  <button
                     key={cat.id}
                     type="button"
                     onClick={() => onCategoryChange(isActive ? undefined : cat.slug)}
                     className={cn(
                        "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer shadow-2xs h-8",
                        isActive
                           ? "bg-primary text-primary-foreground shadow-xs"
                           : "bg-card hover:bg-muted/70 text-foreground border border-border/70"
                     )}
                  >
                     <span>{cat.name}</span>
                     {cat.post_count !== undefined && cat.post_count > 0 && (
                        <span
                           className={cn(
                              "text-[10px] px-1.5 py-0.2 rounded-full font-bold",
                              isActive
                                 ? "bg-primary-foreground/20 text-primary-foreground"
                                 : "bg-muted text-muted-foreground"
                           )}
                        >
                           {cat.post_count}
                        </span>
                     )}
                  </button>
               );
            })}
         </div>

         {/* Optional Tags row if any tag selected or tags available */}
         {tags.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
               <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mr-1">
                  {t("tags")}:
               </span>
               {tags.slice(0, 10).map((tag) => {
                  const isActive = selectedTag === tag.slug;
                  return (
                     <Badge
                        key={tag.id}
                        variant={isActive ? "default" : "outline"}
                        onClick={() => onTagChange(isActive ? undefined : tag.slug)}
                        className={cn(
                           "cursor-pointer text-[11px] font-normal transition-colors shrink-0 h-6 px-2.5",
                           isActive ? "bg-primary" : "hover:bg-muted"
                        )}
                     >
                        #{tag.name}
                     </Badge>
                  );
               })}
            </div>
         )}
      </div>
   );
};

export default BlogFilterBar;
