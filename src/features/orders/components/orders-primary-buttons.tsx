import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";
import { useOrders } from "../context/orders-context";

export function OrdersPrimaryButtons() {
   const { setOpen } = useOrders();
   return (
      <div className="flex gap-2">
      </div>
   );
}
