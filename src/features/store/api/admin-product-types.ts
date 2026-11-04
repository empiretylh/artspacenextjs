import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/config/query-keys";
import type { ProductType, ProductTypeInput } from "@/types";

const PRODUCT_CATEGORIES = ["APPAREL", "MUG", "TOTE", "BOOK", "OTHER"] as const;

/**
 * Numeric fields stay strings through the form and are converted by the caller.
 * `<input type="number">` hands react-hook-form a string, so a coerced schema
 * makes the resolver and the form's own generics disagree.
 */
export const productTypeInputSchema = z.object({
   name: z.string().min(1, "Name is required"),
   category: z.enum(PRODUCT_CATEGORIES),
   base_price: z.string().min(1, "Base price is required"),
   currency: z.string().length(3, "Use the 3-letter currency code"),
   default_royalty_percent: z.string().min(1, "Royalty percentage is required"),
   is_colorable: z.boolean(),
   is_active: z.boolean(),
   sort_order: z.string().min(1, "Sort order is required"),
});

export type ProductTypeFormValues = z.infer<typeof productTypeInputSchema>;

export const createProductType = async (
   data: ProductTypeInput
): Promise<ProductType> => {
   const res = await api.post("/store/product-types/", data);
   return res.data;
};

export const updateProductType = async ({
   id,
   data,
}: {
   id: string;
   data: Partial<ProductTypeInput>;
}): Promise<ProductType> => {
   const res = await api.patch(`/store/product-types/${id}/`, data);
   return res.data;
};

export const deleteProductType = async (id: string): Promise<void> => {
   await api.delete(`/store/product-types/${id}/`);
};

const useInvalidateStoreCatalogue = () => {
   const queryClient = useQueryClient();
   return () => {
      // A product type carries the base price, currency and preview defaults
      // every product renders from, so the whole catalogue is stale.
      queryClient.invalidateQueries({ queryKey: queryKeys.store.all });
   };
};

export const useCreateProductType = () => {
   const invalidate = useInvalidateStoreCatalogue();
   return useMutation({ mutationFn: createProductType, onSuccess: invalidate });
};

export const useUpdateProductType = () => {
   const invalidate = useInvalidateStoreCatalogue();
   return useMutation({ mutationFn: updateProductType, onSuccess: invalidate });
};

export const useDeleteProductType = () => {
   const invalidate = useInvalidateStoreCatalogue();
   return useMutation({ mutationFn: deleteProductType, onSuccess: invalidate });
};
