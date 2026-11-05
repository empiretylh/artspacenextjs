import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { cache } from "react";
import { useAuth } from "@/features/auth/store";

export const getCachedCollector = cache((id: string) => getCollector({ collectorId: id }));

export const getCollector = async ({
   collectorId,
}: {
   collectorId: string;
}): Promise<ApiResponse<User>> => {
   if (!collectorId || collectorId.trim() === "") {
      throw new Error("collectorId is required to get collector");
   }
   const res = await api.get(`/users/profile/public/${collectorId}/`);

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
   const isConfigEnabled = queryConfig?.enabled !== undefined ? Boolean(queryConfig.enabled) : true;
   const hasAuth = accessToken === null || !!accessToken;

   return useQuery({
      ...getCollectorQueryOptions(collectorId),
      ...queryConfig,
      enabled: Boolean(collectorId && collectorId.trim() !== "" && collectorId !== "undefined") && isConfigEnabled && hasAuth,
   });
};
