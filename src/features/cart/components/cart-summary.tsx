'use client'
import { Button } from "@/components/ui/button";
import { useCartStore } from "../store/cart-store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";

export function CartSummary() {
   const { getTotal } = useCartStore();
   const router = useRouter();

   return (
      <div className="p-4 border rounded-md">
         <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
         <p className="text-sm mb-4">Subtotal: {getTotal()}</p>
         <Button
            onClick={() => router.push(paths.checkout.path)}
            className="w-full"
         >
            Checkout
         </Button>
      </div>
   );
}
