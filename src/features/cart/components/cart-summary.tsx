'use client'
import { Button } from "@/components/ui/button";
import { useCartStore } from "../store/cart-store";
import { useRouter } from "next/navigation";
import { paths } from "@/config/paths";
import { useTranslations } from "next-intl";

export function CartSummary() {
   const { getTotal } = useCartStore();
   const router = useRouter();
   const t = useTranslations("Cart");

   return (
      <div className="p-4 border rounded-md">
         <h2 className="text-lg font-semibold mb-2">{t("orderSummary")}</h2>
         <p className="text-sm mb-4">{t("subtotal", { amount: getTotal() })}</p>
         <Button
            onClick={() => router.push(paths.checkout.path)}
            className="w-full"
         >
            {t("checkout")}
         </Button>
      </div>
   );
}
