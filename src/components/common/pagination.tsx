"use client";

import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";

interface PaginationProps {
   total: number; // total items from backend
   page: number; // current page
   limit: number; // items per page
   onPageChange: (page: number) => void;
   onLimitChange: (limit: number) => void;
   showLimitSelector?: boolean;
}

export function Pagination({
   total,
   page,
   limit,
   onPageChange,
   onLimitChange,
   showLimitSelector = true,
}: PaginationProps) {
   const lastPage = Math.max(1, Math.ceil(total / limit));

   const condensedLinks = useMemo(() => {
      const pages: (number | string)[] = [];

      if (lastPage <= 7) {
         for (let i = 1; i <= lastPage; i++) pages.push(i);
      } else {
         pages.push(1);
         if (page > 3) pages.push("…");
         const start = Math.max(2, page - 2);
         const end = Math.min(lastPage - 1, page + 2);
         for (let i = start; i <= end; i++) pages.push(i);
         if (page < lastPage - 2) pages.push("…");
         pages.push(lastPage);
      }

      return pages;
   }, [page, lastPage]);

   return (
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-6">
         {/* Limit Selector */}
         {showLimitSelector ? (
            <div className="flex items-center gap-2">
               <span className="text-sm text-muted-foreground">
                  Rows per page:
               </span>
               <Select
                  value={String(limit)}
                  onValueChange={(value) => onLimitChange(Number(value))}
               >
                  <SelectTrigger className="w-[90px] h-8 text-sm">
                     <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                     {[3, 6, 10, 12, 20, 50, 100].map((option) => (
                        <SelectItem key={option} value={String(option)}>
                           {option}
                        </SelectItem>
                     ))}
                  </SelectContent>
               </Select>
            </div>
         ) : (
            <div />
         )}

         {/* Pagination Controls */}
         <div className="flex items-center justify-center gap-1 sm:gap-2 flex-wrap">
            {/* Prev */}
            <Button
               variant="outline"
               size="sm"
               className="text-xs sm:text-sm"
               disabled={page === 1}
               onClick={() => onPageChange(page - 1)}
            >
               «
            </Button>

            {/* Numbered Pages */}
            {condensedLinks.map((item, i) =>
               item === "…" ? (
                  <span
                     key={i}
                     className="px-2 text-gray-400 select-none text-xs sm:text-sm"
                  >
                     …
                  </span>
               ) : (
                  <Button
                     key={i}
                     variant={item === page ? "default" : "outline"}
                     size="sm"
                     className="text-xs sm:text-sm"
                     onClick={() => onPageChange(item as number)}
                  >
                     {item}
                  </Button>
               )
            )}

            {/* Next */}
            <Button
               variant="outline"
               size="sm"
               className="text-xs sm:text-sm"
               disabled={page === lastPage}
               onClick={() => onPageChange(page + 1)}
            >
               »
            </Button>
         </div>
      </div>
   );
}
