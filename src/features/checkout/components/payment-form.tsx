import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { CreditCard, Lock } from "lucide-react";

export const PaymentForm = ({ formData, handleChange }: any) => (
   <div className="space-y-6">
      <h2 className="text-xl font-bold text-foreground border-b border-border pb-2">
         Payment Details
      </h2>
      <Card className="p-4 space-y-3 bg-secondary">
         <div className="flex items-center space-x-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="font-semibold text-foreground">
               Credit or Debit Card
            </span>
         </div>
         <Input
            id="cardNumber"
            type="tel"
            value={formData.cardNumber}
            onChange={handleChange}
            placeholder="**** **** **** 4242"
         />
         <Input
            id="cardName"
            value={formData.cardName}
            onChange={handleChange}
            placeholder="Jane Doe"
         />
         <div className="grid grid-cols-3 gap-4">
            <Input
               id="cardExpiry"
               value={formData.cardExpiry}
               onChange={handleChange}
               placeholder="12/26"
            />
            <Input
               id="cardCvc"
               type="password"
               value={formData.cardCvc}
               onChange={handleChange}
               placeholder="***"
            />
            <div className="col-span-1 flex items-center justify-center pt-8">
               <Lock className="w-4 h-4 text-muted-foreground mr-1" />
               <span className="text-xs text-muted-foreground">Secure</span>
            </div>
         </div>
      </Card>

      <Card className="p-4 flex justify-between items-center bg-card">
         <div className="flex items-center space-x-3">
            <img
               src="https://www.paypalobjects.com/paypal-ui/logos/svg/paypal-mark-color.svg"
               alt="PayPal"
               className="w-6 h-6"
            />
            <span className="font-semibold text-foreground">
               Pay with PayPal
            </span>
         </div>
         <Button variant="outline" className="h-8 text-xs">
            Connect
         </Button>
      </Card>
   </div>
);
