"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { RefCallBack } from "react-hook-form";

interface DatePickerProps {
   value?: Date;
   onChange: (date: Date) => void;
   placeholder?: string;
   className?: string;
   minDate?: Date;
   maxDate?: Date;
   id?: string;
   name?: string;
   ref?: RefCallBack;
}

const DatePicker = ({
   id,
   name,
   ref,
   value,
   onChange,
   placeholder = "Pick a date",
   className,
   minDate,
   maxDate,
}: DatePickerProps) => {
   const [open, setOpen] = React.useState(false);

   return (
      <Popover open={open} onOpenChange={setOpen}>
         <PopoverTrigger asChild>
            <Button
               variant="outline"
               id={id}
               name={name}
               ref={ref}
               data-empty={!value}
               className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  className
               )}
            >
               <CalendarIcon className="mr-2 h-4 w-4" />
               {value ? format(value, "PPP") : <span>{placeholder}</span>}
            </Button>
         </PopoverTrigger>
         <PopoverContent className="w-auto p-0">
            <Calendar
               mode="single"
               selected={value}
               onSelect={(date) => {
                  if (date) {
                     onChange(date);
                     setOpen(false);
                  }
               }}
               fromDate={minDate}
               toDate={maxDate}
            />
         </PopoverContent>
      </Popover>
   );
};

export default DatePicker;
