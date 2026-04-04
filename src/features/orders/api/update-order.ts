import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Order } from '@/types';
import { MutationConfig } from '@/lib/react-query';

export const updateOrder = ({
  orderId,
  data,
}: {
  orderId: string;
  data: Partial<Order>;
}): Promise<Order> => {
  return api.patch(`/orders/orders/${orderId}/`, data);
};

type UseUpdateOrderOptions = {
  mutationConfig?: MutationConfig<typeof updateOrder>;
};

export const useUpdateOrder = ({ mutationConfig }: UseUpdateOrderOptions = {}) => {
  const queryClient = useQueryClient();

  return useMutation({
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['order', data.id] });
      queryClient.invalidateQueries({ queryKey: ['user-orders'] });
    },
    ...mutationConfig,
    mutationFn: updateOrder,
  });
};
