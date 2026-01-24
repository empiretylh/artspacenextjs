import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Order } from "@/types"; // You should have this defined
import { getOrdersQueryOptions } from "@/features/orders/api/get-orders";

// 🧠 Zod schema for validation
export const createOrderInputSchema = z.object({
   total_price: z.union([z.number(), z.string()]),
   shipping_address: z.string().min(5, {
      message: "Shipping address must be at least 5 characters.",
   }),
   stripe_session_id: z.string().optional(),
   items: z
      .array(
         z.object({
            artworkId: z.string().uuid(),
            price_at_purchase: z.union([z.number(), z.string()]),
            quantity: z.number().min(1),
         })
      )
      .nonempty("Order must include at least one item."),
});

export type CreateOrderInput = z.infer<typeof createOrderInputSchema>;

// 🧾 API call
export const createOrder = ({
   data,
}: {
   data: CreateOrderInput;
}): Promise<Order> => {
   return api.post(`/orders`, data);
};

// 🪄 Hook setup
type UseCreateOrderOptions = {
   mutationConfig?: MutationConfig<typeof createOrder>;
};

export const useCreateOrder = ({
   mutationConfig,
}: UseCreateOrderOptions = {}) => {
   const queryClient = useQueryClient();
   const { onSuccess, ...restConfig } = mutationConfig || {};

   return useMutation({
      mutationFn: createOrder,
      onSuccess: (...args) => {
         // ✅ Invalidate order list cache if it exists
         try {
            queryClient.invalidateQueries({
               queryKey: getOrdersQueryOptions().queryKey,
            });
         } catch (err) {
            // Safe fallback if order list isn't set up
            console.warn(
               "getOrdersQueryOptions not found or failed to invalidate:",
               err
            );
         }
         onSuccess?.(...args);
      },
      ...restConfig,
   });
};
