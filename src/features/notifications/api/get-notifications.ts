import { api } from "@/lib/api-client";
import type { AppNotification } from "@/types";

export const getNotifications = async (): Promise<AppNotification[]> => {
   const response = await api.get<any>("/orders/notifications/");
   if (Array.isArray(response.data)) {
      return response.data;
   }
   return response.data?.results ?? [];
};
