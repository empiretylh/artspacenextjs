"use client";

import { useState } from "react";
import { useCreateOrder } from "@/features/checkout/api/create-order";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useNotifications } from "@/components/ui/notifications";
import { CreditCard, Truck } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function CheckoutPage() {
   const { items, getTotal } = useCartStore();
   const createOrder = useCreateOrder();
   const { addNotification } = useNotifications();
   const [shippingAddress, setShippingAddress] = useState("");

   const handlePlaceOrder = () => {
      if (items.length === 0) {
         addNotification({
            type: "error",
            title: "Cart is empty",
            message: "Add items before checkout.",
         });
         return;
      }

      if (!shippingAddress.trim()) {
         addNotification({
            type: "error",
            title: "Missing address",
            message: "Please enter a shipping address.",
         });
         return;
      }

      createOrder.mutate(
         {
            data: {
               total_price: getTotal(),
               shipping_address: shippingAddress,
               stripe_session_id: "", // left empty for now
               items: items.map((i) => ({
                  artworkId: i.id,
                  price_at_purchase: i.price,
                  quantity: i.quantity,
               })),
            },
         },
         {
            onSuccess: () => {
               addNotification({
                  type: "success",
                  title: "Order created",
                  message: "Your order has been placed!",
               });
            },
            onError: () => {
               addNotification({
                  type: "error",
                  title: "Error",
                  message: "Something went wrong creating the order.",
               });
            },
         }
      );
   };

   return (
      <div>
         <h1 className="text-2xl font-bold mb-6">Checkout</h1>

         <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Shipping Info */}
            <div className="lg:col-span-7 space-y-6">
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Truck className="h-5 w-5" /> Shipping Address
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                     <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <Label htmlFor="first-name">First name</Label>
                           <Input id="first-name" placeholder="John" />
                        </div>
                        <div className="space-y-2">
                           <Label htmlFor="last-name">Last name</Label>
                           <Input id="last-name" placeholder="Doe" />
                        </div>
                     </div>
                     <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" placeholder="123 Art Street" />
                     </div>
                  </CardContent>
               </Card>

               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" /> Payment Method
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     <RadioGroup defaultValue="card" className="grid gap-4">
                        <Label
                           htmlFor="card"
                           className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                           <div className="flex items-center gap-4">
                              <RadioGroupItem value="card" id="card" />
                              <span>Credit Card</span>
                           </div>
                        </Label>
                        <Label
                           htmlFor="paypal"
                           className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                        >
                           <div className="flex items-center gap-4">
                              <RadioGroupItem value="paypal" id="paypal" />
                              <span>PayPal</span>
                           </div>
                        </Label>
                     </RadioGroup>
                  </CardContent>
               </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-5 space-y-4">
               <Card>
                  <CardHeader>
                     <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div>{items.length === 0 ? (
                        <p className="text-muted-foreground">No items in cart.</p>
                     ) : (
                        <div className="space-y-3">
                           {items.map((item) => (
                              <div
                                 key={item.id}
                                 className="flex items-center justify-between border-b pb-2"
                              >
                                 <div>
                                    <p className="font-medium">{item.title}</p>
                                    <p className="text-sm text-muted-foreground">
                                       Qty: {item.quantity}
                                    </p>
                                 </div>
                                 <p>
                                    $
                                    {(Number(item.price) * item.quantity).toFixed(
                                       2
                                    )}
                                 </p>
                              </div>
                           ))}
                           <div className="flex items-center justify-between font-semibold">
                              <p>Total</p>
                              <p>${getTotal().toFixed(2)}</p>
                           </div>
                        </div>
                     )}</div>
                  </CardContent>
               </Card>
               {/* Checkout Action */}
               <Button
                  onClick={handlePlaceOrder}
                  disabled={createOrder.isPending || items.length === 0}
                  className="w-full"
               >
                  {createOrder.isPending ? "Placing Order..." : "Place Order"}
               </Button>
            </div>
         </div>
      </div>
   );
}
