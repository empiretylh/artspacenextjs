"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2, Lock, Minus, Plus } from "lucide-react";

import Link from "@/components/common/link";
import Price from "@/components/common/price";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { paths } from "@/config/paths";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/features/auth/store";
import {
   useCreateCustomerDetails,
   useGetCustomerDetailsList,
} from "@/features/orders/api/customer-checkout-details";
import { useGetDeliveryCharges } from "@/features/orders/api/get-delivery-charges";
import { SavedDetailsSelector } from "@/features/orders/components/saved-details-selector";
import type { CustomerCheckoutDetails, Product, ProductVariant } from "@/types";

import {
   createMerchOrderInputSchema,
   useCreateMerchOrder,
   type CreateMerchOrderInput,
} from "../api/create-merch-order";
import { toPriceCurrency } from "./product-card";

/** Phase 1 is made-to-order with no per-item ceiling, so the stepper needs one. */
const MAX_QUANTITY = 10;

type StoreOrderFormProps = {
   product: Product;
   variant: ProductVariant | null;
};

/**
 * Buy Now for a single merch item: no cart, so the line is chosen here and the
 * order is created straight away. Delivery cities and saved addresses come from
 * the artwork flow because the backend validates merch `city` against the very
 * same DeliveryCharge rows and reuses customer-details.
 */
export const StoreOrderForm = ({ product, variant }: StoreOrderFormProps) => {
   const router = useRouter();
   const user = useAuth((state) => state.user);

   const { data: deliveryCharges, isLoading: isLoadingCharges } = useGetDeliveryCharges();
   const { data: savedDetails = [], isLoading: isLoadingSavedDetails } =
      useGetCustomerDetailsList({ enabled: Boolean(user) });
   const createOrderMutation = useCreateMerchOrder();
   const createCustomerDetailsMutation = useCreateCustomerDetails();

   const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);
   const [hasAutoSelected, setHasAutoSelected] = useState(false);
   const [saveForFuture, setSaveForFuture] = useState(false);

   const form = useForm<CreateMerchOrderInput>({
      resolver: zodResolver(createMerchOrderInputSchema),
      defaultValues: {
         product_id: product.id,
         variant_id: variant?.id ?? "",
         quantity: 1,
         name: "",
         phone_number: "",
         shipping_address: "",
         city: "",
         description: "",
      },
   });

   const quantity = Number(form.watch("quantity")) || 1;
   const selectedCityName = form.watch("city");

   const selectedDelivery = useMemo(
      () => deliveryCharges?.find((charge) => charge.city === selectedCityName),
      [deliveryCharges, selectedCityName],
   );

   const unitPrice = Number(variant?.price ?? product.price) || 0;
   const deliveryFee = Number(selectedDelivery?.charges) || 0;
   const subtotal = unitPrice * quantity;
   const totalPrice = subtotal + deliveryFee;

   const stockLimit =
      variant?.stock === null || variant?.stock === undefined
         ? MAX_QUANTITY
         : Math.min(MAX_QUANTITY, Math.max(0, variant.stock));
   const isOutOfStock = variant !== null && stockLimit === 0;

   const setQuantity = (next: number) => {
      const clamped = Math.min(Math.max(next, 1), Math.max(1, stockLimit));
      form.setValue("quantity", clamped, { shouldValidate: true });
   };

   // The frozen variant id travels with the selection, so a colourway change
   // after the form mounted still orders the option on screen.
   useEffect(() => {
      if (variant) {
         form.setValue("variant_id", variant.id, { shouldValidate: true });
      }
   }, [variant, form]);

   // One-shot prefill from the default saved address, mirroring the artwork flow.
   useEffect(() => {
      if (hasAutoSelected || !user || savedDetails.length === 0) return;

      const defaultEntry = savedDetails.find((entry) => entry.is_default) || savedDetails[0];
      if (defaultEntry) {
         applySavedDetail(defaultEntry);
      }
      setHasAutoSelected(true);
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [savedDetails, hasAutoSelected, user]);

   function applySavedDetail(detail: CustomerCheckoutDetails) {
      const exactCity =
         deliveryCharges?.find(
            (charge) => charge.city.trim().toLowerCase() === detail.city.trim().toLowerCase(),
         )?.city || detail.city;

      setSelectedDetailId(detail.id);
      form.reset({
         product_id: product.id,
         variant_id: variant?.id ?? "",
         quantity: form.getValues("quantity"),
         name: detail.name,
         phone_number: detail.phone_number,
         shipping_address: detail.shipping_address,
         city: exactCity,
         description: detail.description || "",
      });
   }

   const handleSelectDetail = (detail: CustomerCheckoutDetails | null) => {
      if (detail) {
         applySavedDetail(detail);
         return;
      }

      setSelectedDetailId(null);
      setSaveForFuture(false);
      form.reset({
         product_id: product.id,
         variant_id: variant?.id ?? "",
         quantity: form.getValues("quantity"),
         name: "",
         phone_number: "",
         shipping_address: "",
         city: "",
         description: "",
      });
   };

   const isSubmitting =
      createOrderMutation.isPending || createCustomerDetailsMutation.isPending;

   const onSubmit = async (data: CreateMerchOrderInput) => {
      if (!variant) {
         toast.error("Pick a colour and size first.");
         return;
      }
      if (isOutOfStock) {
         toast.error("This option is out of stock.");
         return;
      }

      try {
         if (selectedDetailId === null && saveForFuture) {
            try {
               await createCustomerDetailsMutation.mutateAsync({
                  name: data.name,
                  phone_number: data.phone_number,
                  shipping_address: data.shipping_address,
                  city: data.city,
                  description: data.description || "",
               });
            } catch (saveError) {
               // A failed address save must never block a placed order.
               console.error("Failed to save customer details:", saveError);
            }
         }

         const order = await createOrderMutation.mutateAsync({
            ...data,
            product_id: product.id,
            variant_id: variant.id,
            quantity: Number(data.quantity) || 1,
         });

         toast.success("Order placed", {
            description: "Proceed to payment to complete your purchase.",
         });
         router.replace(paths.order.payment.getHref(order.id));
      } catch (error: any) {
         const status: number | undefined = error?.response?.status;
         const detail: string | undefined = error?.response?.data?.detail;

         if (status === 401 || status === 403) {
            toast.error("Please sign in to place your order.");
            return;
         }

         // 400 covers unpublished/ineligible/out-of-stock/unknown city and 503
         // means the MAS seller account is missing; the backend message names
         // the reason, so it is shown verbatim rather than a generic retry.
         toast.error(detail || "Something went wrong while placing your order.");
      }
   };

   if (!user) {
      return (
         <div className="space-y-3 rounded-xl border border-border/60 bg-card/60 p-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
               <Lock className="size-4 text-primary" />
               <span>Sign in to order</span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
               Merch orders are tied to your account, so please sign in to check out.
            </p>
            <Button
               type="button"
               className="h-11 w-full font-semibold"
               onClick={() =>
                  router.push(
                     `${paths.auth.login.getHref()}?redirectTo=${encodeURIComponent(
                        paths.store.detail.getHref(product.id),
                     )}`,
                  )
               }
            >
               Sign in to continue
            </Button>
         </div>
      );
   }

   return (
      <div className="space-y-5 rounded-xl border border-border/60 bg-card/60 p-4 sm:p-5">
         <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
               <h2 className="truncate text-base font-semibold text-foreground">
                  {product.title}
               </h2>
               <p className="truncate text-xs text-muted-foreground">
                  {variant
                     ? [variant.color_name, variant.size].filter(Boolean).join(" - ")
                     : "Select an option"}
               </p>
            </div>
            <span className="shrink-0 text-sm font-semibold text-primary">
               <Price
                  price={unitPrice}
                  currency={toPriceCurrency(product.currency)}
                  size="sm"
               />
            </span>
         </div>

         {variant === null && (
            <p className="text-xs text-muted-foreground">
               This item has no purchasable option yet. Please check back soon.
            </p>
         )}

         {isOutOfStock && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs text-destructive">
               This colour and size is out of stock.
            </p>
         )}

         <SavedDetailsSelector
            savedDetails={savedDetails}
            selectedId={selectedDetailId}
            onSelect={handleSelectDetail}
            isLoading={isLoadingSavedDetails}
         />

         <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
               <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                     control={form.control}
                     name="name"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm font-medium">Full Name</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="Enter your full name"
                                 className="h-11"
                                 autoComplete="name"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />

                  <FormField
                     control={form.control}
                     name="phone_number"
                     render={({ field }) => (
                        <FormItem>
                           <FormLabel className="text-sm font-medium">Phone Number</FormLabel>
                           <FormControl>
                              <Input
                                 placeholder="e.g. 0912345678"
                                 inputMode="tel"
                                 className="h-11"
                                 autoComplete="tel"
                                 {...field}
                              />
                           </FormControl>
                           <FormMessage />
                        </FormItem>
                     )}
                  />
               </div>

               <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm font-medium">City / Township</FormLabel>
                        <Select
                           onValueChange={field.onChange}
                           value={field.value || ""}
                           disabled={isLoadingCharges}
                        >
                           <FormControl>
                              <SelectTrigger className="h-11 w-full">
                                 <SelectValue placeholder="Select delivery city">
                                    {field.value || undefined}
                                 </SelectValue>
                              </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                              {deliveryCharges?.map((charge) => (
                                 <SelectItem key={charge.id} value={charge.city}>
                                    <div className="flex w-full items-center justify-between gap-4">
                                       <span>{charge.city}</span>
                                       <span className="font-mono text-xs text-muted-foreground">
                                          +{charge.charges} MMK
                                       </span>
                                    </div>
                                 </SelectItem>
                              ))}
                           </SelectContent>
                        </Select>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="shipping_address"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm font-medium">Street Address</FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="House number, street name, ward"
                              className="min-h-[88px] resize-none"
                              autoComplete="street-address"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                     <FormItem>
                        <FormLabel className="text-sm font-medium">
                           Order Notes{" "}
                           <span className="text-xs font-normal text-muted-foreground">
                              (Optional)
                           </span>
                        </FormLabel>
                        <FormControl>
                           <Textarea
                              placeholder="Print placement notes or courier landmark"
                              className="min-h-[72px] resize-none"
                              {...field}
                           />
                        </FormControl>
                        <FormMessage />
                     </FormItem>
                  )}
               />

               {/* Quantity stepper: 44px targets keep it usable on a phone. */}
               <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-foreground">Quantity</span>
                  <div className="flex items-center gap-1 rounded-full border border-border/60 bg-background p-1">
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Decrease quantity"
                        className="size-9 rounded-full"
                        disabled={quantity <= 1 || isSubmitting}
                        onClick={() => setQuantity(quantity - 1)}
                     >
                        <Minus className="size-4" />
                     </Button>
                     <span
                        aria-live="polite"
                        className="min-w-9 text-center text-sm font-semibold tabular-nums text-foreground"
                     >
                        {quantity}
                     </span>
                     <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Increase quantity"
                        className="size-9 rounded-full"
                        disabled={quantity >= stockLimit || isSubmitting || isOutOfStock}
                        onClick={() => setQuantity(quantity + 1)}
                     >
                        <Plus className="size-4" />
                     </Button>
                  </div>
               </div>

               {selectedDetailId === null && (
                  <div className="flex items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-3">
                     <Checkbox
                        id="store-save-for-future"
                        checked={saveForFuture}
                        onCheckedChange={(checked) => setSaveForFuture(Boolean(checked))}
                        className="mt-0.5"
                     />
                     <label
                        htmlFor="store-save-for-future"
                        className="cursor-pointer text-xs leading-relaxed"
                     >
                        <span className="block font-medium text-foreground">
                           Save this address for future orders
                        </span>
                        <span className="block text-muted-foreground">
                           Reused by both artwork and store checkouts.
                        </span>
                     </label>
                  </div>
               )}

               <div className="space-y-2 border-t border-border/50 pt-4 text-sm">
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">
                        Item total ({quantity})
                     </span>
                     <span className="font-medium text-foreground">
                        <Price
                           price={subtotal}
                           currency={toPriceCurrency(product.currency)}
                           size="sm"
                        />
                     </span>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-muted-foreground">Delivery</span>
                     <span className="font-medium text-foreground">
                        {selectedDelivery ? (
                           <Price
                              price={selectedDelivery.charges}
                              currency={toPriceCurrency(product.currency)}
                              size="sm"
                           />
                        ) : (
                           <span className="text-xs italic">Set after city selection</span>
                        )}
                     </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border/50 pt-3">
                     <span className="font-semibold">Total</span>
                     <span className="font-semibold text-primary">
                        <Price
                           price={totalPrice}
                           currency={toPriceCurrency(product.currency)}
                           size="sm"
                        />
                     </span>
                  </div>
               </div>

               <Button
                  type="submit"
                  size="lg"
                  className="h-12 w-full text-base font-semibold shadow-xs"
                  disabled={isSubmitting || !variant || isOutOfStock}
               >
                  {isSubmitting ? (
                     <>
                        <Loader2 className="mr-2 size-4 animate-spin" />
                        Placing Order...
                     </>
                  ) : (
                     "Buy Now"
                  )}
               </Button>

               <p className="text-center text-xs text-muted-foreground">
                  Printed on demand and shipped nationwide.{" "}
                  <Link to={paths.store.getHref()} className="text-primary hover:underline">
                     Back to store
                  </Link>
               </p>
            </form>
         </Form>
      </div>
   );
};

export default StoreOrderForm;
