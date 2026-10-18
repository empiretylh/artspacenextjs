import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/config/query-keys";
import type {
  CustomerCheckoutDetails,
  CreateCustomerCheckoutDetailsInput,
  UpdateCustomerCheckoutDetailsInput,
} from "@/types";
import { z } from "zod";

export const customerCheckoutDetailsInputSchema = z.object({
  label: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  phone_number: z.string().min(6, "Phone number is required"),
  shipping_address: z.string().min(5, "Shipping address must be at least 5 characters"),
  city: z.string().min(1, "City is required"),
  description: z.string().optional(),
  is_default: z.boolean().optional(),
});

export type CustomerCheckoutDetailsFormValues = z.infer<typeof customerCheckoutDetailsInputSchema>;

export const getCustomerDetailsList = async (): Promise<CustomerCheckoutDetails[]> => {
  const res = await api.get("/orders/customer-details/");
  if (Array.isArray(res.data)) {
    return res.data;
  }
  if (res.data && Array.isArray(res.data.results)) {
    return res.data.results;
  }
  return [];
};

export const getCustomerDetails = async (id: number): Promise<CustomerCheckoutDetails> => {
  const res = await api.get(`/orders/customer-details/${id}/`);
  return res.data;
};

export const createCustomerDetails = async (
  data: CreateCustomerCheckoutDetailsInput
): Promise<CustomerCheckoutDetails> => {
  const res = await api.post("/orders/customer-details/", data);
  return res.data;
};

export const updateCustomerDetails = async ({
  id,
  data,
}: {
  id: number;
  data: UpdateCustomerCheckoutDetailsInput;
}): Promise<CustomerCheckoutDetails> => {
  const res = await api.patch(`/orders/customer-details/${id}/`, data);
  return res.data;
};

export const deleteCustomerDetails = async (id: number): Promise<void> => {
  await api.delete(`/orders/customer-details/${id}/`);
};

export const useGetCustomerDetailsList = (options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: queryKeys.customerDetails.list(),
    queryFn: getCustomerDetailsList,
    enabled: options?.enabled ?? true,
  });
};

export const useGetCustomerDetails = (id?: number) => {
  return useQuery({
    queryKey: id ? queryKeys.customerDetails.detail(id) : queryKeys.customerDetails.all,
    queryFn: () => getCustomerDetails(id!),
    enabled: typeof id === "number" && !isNaN(id),
  });
};

export const useCreateCustomerDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomerDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerDetails.all });
    },
  });
};

export const useUpdateCustomerDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomerDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerDetails.all });
    },
  });
};

export const useDeleteCustomerDetails = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomerDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.customerDetails.all });
    },
  });
};
