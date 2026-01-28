import { Button } from "@/components/ui/button";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import type { Order } from "@/types";
import { type Row } from "@tanstack/react-table";
import { RxDotsHorizontal } from "react-icons/rx";
import { useOrders } from "../context/orders-context";
import Link from "@/components/common/link"
import { paths } from "@/config/paths";

interface DataTableRowActionsProps<TData> {
   row: Row<TData>;
}

export function DataTableRowActions<TData>({
   row,
}: DataTableRowActionsProps<TData>) {
   const { setOpen, setCurrentRow } = useOrders();
   const order = row.original as Order;
   return (
      <DropdownMenu modal={false}>
         <DropdownMenuTrigger asChild>
            <Button
               variant="ghost"
               className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
               <RxDotsHorizontal className="h-4 w-4" />
               <span className="sr-only">Open menu</span>
            </Button>
         </DropdownMenuTrigger>
         <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem
               asChild
            >
               <Link to={paths.order.detail.getHref(String(order.id))}>View</Link>
            </DropdownMenuItem>
         </DropdownMenuContent>
      </DropdownMenu>
   );
}
