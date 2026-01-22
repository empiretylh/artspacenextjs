import { queryOptions, useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import type { QueryConfig } from "@/lib/react-query";
import type { ApiResponse, Event } from "@/types";
import type { AxiosResponse } from "axios";
import { queryKeys } from "@/config/query-keys";

export const getEvent = ({
   eventSlug,
}: {
   eventSlug: string;
}): Promise<AxiosResponse<ApiResponse<Event>>> => {
   return api.get(`/artworks/events/${eventSlug}`);
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
   return useQuery({
      ...getEventQueryOptions(eventSlug),
      ...queryConfig,
   });
};
