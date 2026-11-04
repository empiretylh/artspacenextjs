import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/config/query-keys";
import type { Product, ProductInput, ProductVariantInput } from "@/types";

const HEX_COLOR = /^#[0-9A-Fa-f]{6}$/;

/**
 * Form-side option row. `stock` and `sort_order` are not rendered as inputs in
 * phase 1, so they keep their API types; everything a human types stays a
 * string until `toVariantPayload` converts it.
 */
export const productVariantInputSchema = z.object({
   id: z.string().optional(),
   color_name: z.string().min(1, "Colour name is required"),
   color_hex: z.string().regex(HEX_COLOR, "Use a 6-digit hex colour such as #1A1B22"),
   size: z.string().min(1, "Size is required"),
   sku: z.string().min(1, "SKU is required"),
   price_modifier: z.string(),
   stock: z.number().int().min(0).nullable(),
   is_active: z.boolean(),
   sort_order: z.number().int(),
});

export const productInputSchema = z.object({
   title: z.string().min(1, "Title is required"),
   description: z.string(),
   product_type: z.string().min(1, "Choose the shape this item is printed on"),
   artwork: z.string().min(1, "Paste the artwork id this item prints"),
   price_override: z.string(),
   royalty_percent: z.string(),
   is_published: z.boolean(),
   print_x: z.string().min(1, "Required"),
   print_y: z.string().min(1, "Required"),
   print_w: z.string().min(1, "Required"),
   print_h: z.string().min(1, "Required"),
   variants: z.array(productVariantInputSchema).min(1, "Add at least one option"),
});

export type ProductFormValues = z.infer<typeof productInputSchema>;
export type ProductVariantFormValues = z.infer<typeof productVariantInputSchema>;

export const createProduct = async (data: ProductInput): Promise<Product> => {
   const res = await api.post("/store/products/", data);
   return res.data;
};

export const updateProduct = async ({
   id,
   data,
}: {
   id: string;
   data: Partial<ProductInput>;
}): Promise<Product> => {
   const res = await api.patch(`/store/products/${id}/`, data);
   return res.data;
};

export const deleteProduct = async (id: string): Promise<void> => {
   await api.delete(`/store/products/${id}/`);
};

const useInvalidateStoreCatalogue = () => {
   const queryClient = useQueryClient();
   return () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.store.all });
   };
};

export const useCreateProduct = () => {
   const invalidate = useInvalidateStoreCatalogue();
   // Variants are written nested, so one POST creates the item and every
   // colourway on it; the server returns the fully hydrated product.
   return useMutation({ mutationFn: createProduct, onSuccess: invalidate });
};

export const useUpdateProduct = () => {
   const invalidate = useInvalidateStoreCatalogue();
   return useMutation({ mutationFn: updateProduct, onSuccess: invalidate });
};

export const useDeleteProduct = () => {
   const invalidate = useInvalidateStoreCatalogue();
   return useMutation({ mutationFn: deleteProduct, onSuccess: invalidate });
};

export const toVariantPayload = (
   values: ProductVariantFormValues[]
): ProductVariantInput[] =>
   values.map((variant) => ({
      ...(variant.id ? { id: variant.id } : {}),
      color_name: variant.color_name,
      color_hex: variant.color_hex.toUpperCase(),
      size: variant.size,
      sku: variant.sku,
      price_modifier: variant.price_modifier.trim() || "0",
      stock: variant.stock,
      is_active: variant.is_active,
      sort_order: variant.sort_order,
   }));
