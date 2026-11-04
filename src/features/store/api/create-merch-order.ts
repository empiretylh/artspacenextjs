import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

import { api } from "@/lib/api-client";
import type { MutationConfig } from "@/lib/react-query";
import type { Order } from "@/types";

export const createMerchOrderInputSchema = z.object({
   product_id: z.string().uuid(),
   variant_id: z.string().uuid(),
   quantity: z.number().int().min(1),
   name: z.string().min(1, "Name is required"),
   shipping_address: z.string().min(5, "Shipping address must be at least 5 characters"),
   phone_number: z.string().min(8, "Phone number is required"),
   city: z.string().min(1, "City is required"),
   description: z.string().optional(),
});

export type CreateMerchOrderInput = z.infer<typeof createMerchOrderInputSchema>;

/**
 * Buy Now for one merch item. Phase 1 has no server cart, so this is a sibling
 * of the single-artwork order call rather than a multi-item checkout.
 */
export const createMerchOrder = async (
   data: CreateMerchOrderInput,
): Promise<Order> => {
   const res = await api.post("/store/orders/", data);
   return res.data;
};

type UseCreateMerchOrderOptions = {
   mutationConfig?: MutationConfig<typeof createMerchOrder>;
};

export const useCreateMerchOrder = ({ mutationConfig }: UseCreateMerchOrderOptions = {}) => {
   const queryClient = useQueryClient();
   return useMutation({
      mutationFn: createMerchOrder,
      onSuccess: () => {
         // Merch and artwork orders share the history screens, so both key
         // prefixes are stale once a merch line is placed.
         queryClient.invalidateQueries({ queryKey: ["user-orders"] });
         queryClient.invalidateQueries({ queryKey: ["orders"] });
      },
      ...mutationConfig,
   });
};
