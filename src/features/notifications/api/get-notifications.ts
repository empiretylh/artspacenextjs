import { api } from "@/lib/api-client";
import { isEndpointUnavailable } from "@/lib/api-unavailable";
import type { AppNotification } from "@/types";

export const getNotifications = async (): Promise<AppNotification[]> => {
   if (isEndpointUnavailable("notifications")) {
      return [];
   }

   const response = await api.get<any>("/orders/notifications/");
   if (Array.isArray(response.data)) {
      return response.data;
   }
   return response.data?.results ?? [];
};
