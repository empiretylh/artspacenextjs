import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, User } from "@/types";
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

export const getCollector = ({
   collectorId,
}: {
   collectorId: string;
}): Promise<AxiosResponse<ApiResponse<User>>> => {
   return api.get(`/users/collector/${collectorId}`);
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

export const useGetCollector = ({
   collectorId,
   queryConfig,
}: UseCollectorOptions) => {
   return useQuery({
      ...getCollectorQueryOptions(collectorId),
      ...queryConfig,
   });
};
