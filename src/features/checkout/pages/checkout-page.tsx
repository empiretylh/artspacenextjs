"use client";

import { useState } from "react";
import { useCreateOrder } from "@/features/orders/api/create-order";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/features/cart/store/cart-store";
import { useNotifications } from "@/components/ui/notifications";

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
      <div className="container mx-auto py-8 max-w-3xl">
         <h1 className="text-2xl font-bold mb-6">Checkout</h1>

         <div className="grid gap-6">
            {/* Shipping Info */}
            <Card>
               <CardHeader>
                  <CardTitle>Shipping Information</CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <Label htmlFor="address">Shipping Address</Label>
                     <Input
                        id="address"
                        placeholder="Enter your address"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                     />
                  </div>
               </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
               <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
               </CardHeader>
               <CardContent>
                  {items.length === 0 ? (
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
                  )}
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
   );
}
