import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";

export const getCachedCollector = cache((id: string) => getCollector({ collectorId: id }))

export const getCollector = async ({
   collectorId,
}: {
   collectorId: string;
}): Promise<ApiResponse<User>> => {
   const res = await api.get(`/users/collector/${collectorId}`);

   return res.data;
};

export const getCollectorQueryOptions = (collectorId: string) => {
   return queryOptions({
      queryKey: queryKeys.collector.detail(collectorId),
      queryFn: () => getCollector({ collectorId }),
   });
};

type UseCollectorOptions = {
   collectorId: string;
   queryConfig?: QueryConfig<typeof getCollectorQueryOptions>;
};

export const useGetCollector = ({ collectorId, queryConfig }: UseCollectorOptions) => {
   const { accessToken } = useAuth.getState();

   return useQuery({
      ...getCollectorQueryOptions(collectorId),
      ...queryConfig,
      enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
   });
};
