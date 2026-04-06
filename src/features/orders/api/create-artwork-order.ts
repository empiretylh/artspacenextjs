import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { z } from "zod";

export const createArtworkOrderInputSchema = z.object({
  artwork_id: z.string().uuid(),
  name: z.string().min(1, "Name is required"),
  shipping_address: z.string().min(5, "Shipping address must be at least 5 characters"),
  phone_number: z.string().min(8, "Phone number is required"),
  description: z.string().optional(),
  city: z.string().min(1, "City is required"),
});

export type CreateArtworkOrderInput = z.infer<typeof createArtworkOrderInputSchema>;

export const createArtworkOrder = async (data: CreateArtworkOrderInput): Promise<any> => {
  const res = await api.post("/orders/orders/", data);
  return res.data;
};

export const useCreateArtworkOrder = () => {
  return useMutation({
    mutationFn: createArtworkOrder,
  });
};
