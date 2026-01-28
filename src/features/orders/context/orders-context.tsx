import useDialogState from "@/hooks/use-dialog-state";
import { type Order } from "@/types";
import React, { useState } from "react";

type OrdersDialogType =
   | "update"
   | "delete"
   | "soft-delete"
   | "import"
   | "export"
   | "image"
   | "soft-delete-many"
   | "restore"
   | "restore-many";

interface OrdersContextType {
   open: OrdersDialogType | null;
   setOpen: (str: OrdersDialogType | null) => void;
   currentRow: Order | null;
   setCurrentRow: React.Dispatch<React.SetStateAction<Order | null>>;
   selectedRows: Order[];
   setSelectedRows: React.Dispatch<React.SetStateAction<Order[]>>;
}

const OrdersContext = React.createContext<OrdersContextType | null>(null);

interface Props {
   children: React.ReactNode;
}

export default function OrdersProvider({ children }: Props) {
   const [open, setOpen] = useDialogState<OrdersDialogType>(null);
   const [currentRow, setCurrentRow] = useState<Order | null>(null);
   const [selectedRows, setSelectedRows] = useState<Order[]>([]);
   return (
      <OrdersContext.Provider
         value={{
            open,
            setOpen,
            currentRow,
            setCurrentRow,
            selectedRows,
            setSelectedRows,
         }}
      >
         {children}
      </OrdersContext.Provider>
   );
}

// eslint-disable-next-line react-refresh/only-export-components
export const useOrders = () => {
   const ordersContext = React.useContext(OrdersContext);

   if (!ordersContext) {
      throw new Error("useOrders has to be used within <OrdersContext>");
   }

   return ordersContext;
};
