import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Truck } from "lucide-react";

export const OrderSummary = ({
   item,
   summary,
}: {
   item: any;
   summary: any;
}) => (
   <Card className="p-6 space-y-6">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
         Order Summary
      </h2>

      {/* Item */}
      <div className="flex space-x-4 border-b border-border pb-4">
         <img
            src={item.imageUrl}
            alt={item.title}
            className="w-20 h-24 object-cover rounded-lg"
         />
         <div className="flex-grow space-y-0.5">
            <h3 className="text-base font-semibold text-foreground">
               {item.title}
            </h3>
            <p className="text-sm text-muted-foreground">by {item.artist}</p>
            <p className="text-sm text-primary font-bold pt-1">
               ${item.price.toLocaleString()}
            </p>
         </div>
         <p className="text-sm text-muted-foreground self-start">
            Qty: {item.quantity}
         </p>
      </div>

      {/* Totals */}
      <div className="space-y-3">
         <div className="flex justify-between text-base text-foreground/80">
            <span>Subtotal</span>
            <span>${summary.subtotal.toLocaleString()}</span>
         </div>
         <div className="flex justify-between text-base text-foreground/80">
            <span>
               Shipping{" "}
               <Truck className="inline w-4 h-4 text-muted-foreground mb-0.5" />
            </span>
            <span>${summary.shippingCost.toLocaleString()}</span>
         </div>
         <div className="flex justify-between text-base text-foreground/80">
            <span>Estimated Tax</span>
            <span>$0.00</span>
         </div>
         <div className="flex justify-between pt-3 border-t border-border">
            <span className="text-xl font-bold">Order Total</span>
            <span className="text-xl font-bold text-primary">
               ${summary.total.toLocaleString()}
            </span>
         </div>
      </div>

      {/* Placeholder for Coupon/Promo Code */}
      <div className="space-y-2 pt-4">
         <Input
            id="promo"
            value=""
            placeholder="Enter Code"
            onChange={() => {}}
         />
         <Button variant="outline" className="w-full">
            Apply Discount
         </Button>
      </div>
   </Card>
);
