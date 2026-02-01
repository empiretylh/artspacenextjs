import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, Event } from "@/types";
import { queryKeys } from "@/config/query-keys";

export const getEventInterestStatus = async ({
   eventSlug,
}: {
   eventSlug: string;
}): Promise<ApiResponse<Event>> => {
   const res = await api.get(`/artworks/events/${eventSlug}`);

   return res.data;
};

export const getEventInterestStatusQueryOptions = (eventSlug: string) => {
   return queryOptions({
      queryKey: queryKeys.event.interested.status(eventSlug),
      queryFn: () => getEventInterestStatus({ eventSlug }),
   });
};

type UseEventOptions = {
   eventSlug: string;
   queryConfig?: QueryConfig<typeof getEventInterestStatusQueryOptions>;
};

export const useGetEventInterestStatus = ({ eventSlug, queryConfig }: UseEventOptions) => {
   return useQuery({
      ...getEventInterestStatusQueryOptions(eventSlug),
      ...queryConfig,
      select: (data) => data.is_interested,
   });
};
