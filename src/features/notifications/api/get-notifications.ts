import { api } from "@/lib/api-client";
import type { AppNotification } from "@/types";

export const getNotifications = async (): Promise<AppNotification[]> => {
   const response = await api.get<AppNotification[]>("/orders/notifications/");
   return response.data;
 };
