import { useQuery, queryOptions } from '@tanstack/react-query';
import { api } from '@/lib/api-client';
import { Order } from '@/types';
import { QueryConfig } from '@/lib/react-query';

export const getOrder = ({ orderId }: { orderId: string }): Promise<Order> => {
  return api.get(`/orders/orders/${orderId}/`).then((res) => res.data);
};

export const getOrderQueryOptions = (orderId: string) => {
  return queryOptions({
    queryKey: ['order', orderId],
    queryFn: () => getOrder({ orderId }),
  });
};

type UseOrderOptions = {
  orderId: string;
  queryConfig?: QueryConfig<typeof getOrderQueryOptions>;
};

export const useGetOrder = ({ orderId, queryConfig }: UseOrderOptions) => {
  return useQuery({
    ...getOrderQueryOptions(orderId),
    ...queryConfig,
  });
};
