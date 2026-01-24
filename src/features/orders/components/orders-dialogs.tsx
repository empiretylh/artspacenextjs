import { useOrders } from "../context/orders-context";
import { type Table } from "@tanstack/react-table";

interface OrdersDialogsProps<TData> {
   table: Table<TData>;
}

export function OrdersDialogs<TData>({ table }: OrdersDialogsProps<TData>) {
   const { open, setOpen, currentRow, selectedRows, setSelectedRows } =
      useOrders();

   return (
      <>
      </>
   );
}
