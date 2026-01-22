import { Button } from "@/components/ui/button";
import { useCartStore } from "../store/cart-store";
import { getImage } from "@/lib/utils";

export function CartItem({ item }: { item: any }) {
   const { removeFromCart } = useCartStore();

   return (
      <div className="flex items-center justify-between border-b py-4">
         <div className="flex items-center gap-4">
            <img
               src={getImage(item.image)}
               alt={item.title}
               className="w-24 h-24 object-contain rounded-md"
            />
            <div>
               <h3 className="font-semibold">{item.title}</h3>
               <p className="text-sm text-muted-foreground">{item.price}</p>
            </div>
         </div>
         <div className="flex flex-col items-end">
            <p className="font-medium">
               {(item.price * item.quantity).toFixed(2)}
            </p>
            <Button
               variant="destructive"
               size="sm"
               className="mt-2"
               onClick={() => removeFromCart(item.id)}
            >
               Remove
            </Button>
         </div>
      </div>
   );
}
