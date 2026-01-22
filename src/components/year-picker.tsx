import React, { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// YearPicker
// Props:
// - value?: number (controlled)
// - defaultValue?: number (uncontrolled)
// - onChange?: (year: number) => void
// - minYear?: number
// - maxYear?: number
// - yearsPerPage?: number (how many years to show in grid for a decade-like view)

type YearPickerProps = {
   value?: number;
   defaultValue?: number;
   onChange?: (year: number) => void;
   minYear?: number;
   maxYear?: number;
   yearsPerPage?: number; // e.g. 12 -> 3 rows x 4 cols
   placeholder?: string;
   className?: string;
   id: string;
};

export default function YearPicker({
   value,
   defaultValue,
   onChange,
   minYear = 1900,
   maxYear = 2100,
   yearsPerPage = 12,
   placeholder = "Select year",
   className,
   id,
}: YearPickerProps) {
   const today = new Date();
   const startValue = value ?? defaultValue ?? today.getFullYear();

   const [internalYear, setInternalYear] = useState<number>(startValue);
   const selectedYear = value ?? internalYear;

   // compute the current page's start year (e.g. decade block)
   const yearsPerRow = 4;
   const rows = Math.ceil(yearsPerPage / yearsPerRow);

   const pageStart = useMemo(() => {
      // compute block start so selectedYear sits inside the block
      const blockIndex = Math.floor((selectedYear - minYear) / yearsPerPage);
      return minYear + blockIndex * yearsPerPage;
   }, [selectedYear, minYear, yearsPerPage]);

   const [anchorStart, setAnchorStart] = useState<number>(pageStart);

   // when selectedYear changes externally, keep the anchorStart in range
   React.useEffect(() => {
      const blockIndex = Math.floor((selectedYear - minYear) / yearsPerPage);
      const newStart = minYear + blockIndex * yearsPerPage;
      setAnchorStart((s) => (s === newStart ? s : newStart));
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectedYear]);

   const years = useMemo(() => {
      const arr: number[] = [];
      for (let i = 0; i < yearsPerPage; i++) {
         arr.push(anchorStart + i);
      }
      return arr.filter((y) => y >= minYear && y <= maxYear);
   }, [anchorStart, yearsPerPage, minYear, maxYear]);

   function pickYear(year: number) {
      if (year < minYear || year > maxYear) return;
      if (value === undefined) setInternalYear(year);
      onChange?.(year);
   }

   function prevPage() {
      setAnchorStart((s) => Math.max(minYear, s - yearsPerPage));
   }
   function nextPage() {
      setAnchorStart((s) =>
         Math.min(maxYear - yearsPerPage + 1, s + yearsPerPage)
      );
   }

   return (
      <Popover>
         <PopoverTrigger id={id} asChild>
            <Button
               variant="outline"
               className={cn(
                  "w-40 justify-between block bg-transparent dark:bg-input/30",
                  className
               )}
            >
               {selectedYear ?? placeholder}
            </Button>
         </PopoverTrigger>
         <PopoverContent
            align="start"
            className="w-[300px] p-0 overflow-hidden"
         >
            <Card className="rounded-none">
               <CardHeader className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <button
                        aria-label="previous"
                        onClick={prevPage}
                        className="rounded px-2 py-1 hover:bg-muted"
                     >
                        ‹
                     </button>
                     <CardTitle className="text-sm">
                        {anchorStart} —{" "}
                        {Math.min(anchorStart + yearsPerPage - 1, maxYear)}
                     </CardTitle>
                     <button
                        aria-label="next"
                        onClick={nextPage}
                        className="rounded px-2 py-1 hover:bg-muted"
                     >
                        ›
                     </button>
                  </div>
                  <div className="text-xs text-muted-foreground">Years</div>
               </CardHeader>
               <CardContent className="p-2">
                  <div
                     className="grid gap-2"
                     style={{
                        gridTemplateColumns: `repeat(${yearsPerRow}, minmax(0,1fr))`,
                     }}
                  >
                     {years.map((y) => {
                        const isSelected = y === selectedYear;
                        return (
                           <button
                              key={y}
                              onClick={() => pickYear(y)}
                              className={cn(
                                 "rounded p-2 text-sm hover:bg-muted focus:outline-none",
                                 isSelected
                                    ? "ring-2 ring-offset-1 ring-primary bg-primary/10"
                                    : "bg-transparent"
                              )}
                              aria-pressed={isSelected}
                           >
                              {y}
                           </button>
                        );
                     })}
                  </div>
               </CardContent>
            </Card>
         </PopoverContent>
      </Popover>
   );
}

/*
Usage (example):

import YearPicker from "./YearPicker";

function Example() {
  const [year, setYear] = React.useState<number | undefined>(undefined);
  return (
    <div>
      <YearPicker
        value={year}
        onChange={(y) => setYear(y)}
        minYear={1950}
        maxYear={2030}
        yearsPerPage={12}
      />
    </div>
  );
}

Notes:
- This component uses shadcn/ui components (Button, Popover, Card).
- It is intentionally dependency-free (no date-fns). Adjust styling as needed.
*/
