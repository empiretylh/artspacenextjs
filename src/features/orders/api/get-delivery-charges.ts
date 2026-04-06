import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { queryKeys } from "@/config/query-keys";

export type DeliveryCharge = {
  id: number;
  city: string;
  charges: string;
};

export const getDeliveryCharges = async (): Promise<DeliveryCharge[]> => {
  const res = await api.get("/orders/delivery-charges/");
  return res.data;
};

export const useGetDeliveryCharges = () => {
  return useQuery({
    queryKey: ["delivery-charges"],
    queryFn: getDeliveryCharges,
  });
};
