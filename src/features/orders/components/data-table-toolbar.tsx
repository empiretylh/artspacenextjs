import { useMemo } from "react";
import { debounce } from "lodash"; // or use your own debounce util
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Table } from "@tanstack/react-table";
import { RxCross2 } from "react-icons/rx";
import { DataTableViewOptions } from "./data-table-view-options";
import { OrderStatusFilter, StatusFilter } from "./order-status-filter";

interface DataTableToolbarProps<TData> {
   table: Table<TData>;
}

export function DataTableToolbar<TData>({
   table,
}: DataTableToolbarProps<TData>) {
   const isFiltered = table.getState().columnFilters.length > 0;

   // 👇 debounce wrapper (300ms delay)
   const debouncedFilter = useMemo(
      () =>
         debounce((value: string) => {
            table.setGlobalFilter(value);
         }, 500),
      [table]
   );

   return (
      <div className="flex items-center justify-between">
         <div className="flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2">
            <Input
               placeholder="Filter orders..."
               defaultValue={table.getState().globalFilter ?? ""}
               onChange={(event) => debouncedFilter(event.target.value)}
               className="h-8 w-[150px] lg:w-[250px]"
            />
            {isFiltered && (
               <Button
                  variant="ghost"
                  onClick={() => table.resetColumnFilters()}
                  className="h-8 px-2 lg:px-3"
               >
                  Reset
                  <RxCross2 className="ml-2 h-4 w-4" />
               </Button>
            )}
         </div>
         <div className="flex items-center space-x-2">
            <OrderStatusFilter
               onChange={(value) =>
                  table.getColumn("recordStatus")?.setFilterValue(value)
               }
               initialValue={
                  (table
                     .getColumn("recordStatus")
                     ?.getFilterValue() as StatusFilter) ?? "active"
               }
            />
            <DataTableViewOptions table={table} />
         </div>
      </div>
   );
}
