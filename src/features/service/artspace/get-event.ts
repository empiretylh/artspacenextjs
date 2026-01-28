import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, Event } from "@/types";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";

export const getEvent = async ({
   eventSlug,
}: {
   eventSlug: string;
}): Promise<ApiResponse<Event>> => {
   const res = await api.get(`/artworks/events/${eventSlug}`);

   return res.data;
};

export const getEventQueryOptions = (eventSlug: string) => {
   return queryOptions({
      queryKey: queryKeys.event.detail(eventSlug),
      queryFn: () => getEvent({ eventSlug }),
   });
};

type UseEventOptions = {
   eventSlug: string;
   queryConfig?: QueryConfig<typeof getEventQueryOptions>;
};

export const useGetEvent = ({ eventSlug, queryConfig }: UseEventOptions) => {
   const { accessToken } = useAuth.getState();
   return useQuery({
      ...getEventQueryOptions(eventSlug),
      ...queryConfig,
      enabled: queryConfig?.enabled ? queryConfig.enabled && (accessToken === null || !!accessToken) : (accessToken === null || !!accessToken)
   });
};
