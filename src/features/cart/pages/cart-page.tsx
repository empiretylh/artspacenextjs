'use client'
import { CartItem } from "../components/cart-item";
import { CartSummary } from "../components/cart-summary";
import { useCartStore } from "../store/cart-store";

export default function CartPage() {
   const { items } = useCartStore();

   return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Your Cart</h1>

         {items.length === 0 ? (
            <div className="text-center">
               <p className="text-muted-foreground mb-4">Your cart is empty.</p>
               {/* <Button
                  onClick={() =>
                     addToCart({
                        id: sampleProduct.id,
                        title: sampleProduct.title,
                        price: sampleProduct.price,
                        image: sampleProduct.image,
                     })
                  }
               >
                  Add Sample Product
               </Button> */}
            </div>
         ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="md:col-span-2">
                  {items.map((item) => (
                     <CartItem key={item.id} item={item} />
                  ))}
               </div>
               <CartSummary />
            </div>
         )}
      </div>
   );
}
