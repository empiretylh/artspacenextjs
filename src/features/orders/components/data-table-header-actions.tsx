import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type Row, type Table } from "@tanstack/react-table";
import { RxDotsHorizontal } from "react-icons/rx";
import { useOrders } from "../context/orders-context";
import type { Order } from "@/types";

interface DataTableHeaderActionsProps<TData> {
   selectedRows: Row<TData>[];
   table: Table<TData>;
}

export function DataTableHeaderActions<TData>({
   selectedRows,
   table,
}: DataTableHeaderActionsProps<TData>) {
   const { setOpen, setSelectedRows } = useOrders();
   const isCurrentTableFilterBy = (key: string, value: string) => {
      return (
         table
            .getState()
            .columnFilters.filter(
               (obj) => obj.id === key && obj.value === value
            ).length > 0
      );
   };

   return (
      <DropdownMenu modal={false}>
         <DropdownMenuTrigger asChild>
            <Button
               disabled={selectedRows.length === 0}
               variant="ghost"
               className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
               <RxDotsHorizontal className="h-4 w-4" />
               <span className="sr-only">Open menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-[160px]">
            {isCurrentTableFilterBy("recordStatus", "active") && (
               <DropdownMenuItem
                  onClick={() => {
                     setSelectedRows(
                        selectedRows.map((row) => row.original as Order)
                     );
                     setOpen("soft-delete-many");
                  }}
               >
                  Bulk Soft Delete
               </DropdownMenuItem>
            )}
            {isCurrentTableFilterBy("recordStatus", "deleted") && (
               <DropdownMenuItem
                  onClick={() => {
                     setSelectedRows(
                        selectedRows.map((row) => row.original as Order)
                     );
                     setOpen("restore-many");
                  }}
               >
                  Bulk Restore
               </DropdownMenuItem>
            )}
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
