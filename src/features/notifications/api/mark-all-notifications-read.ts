import { api } from "@/lib/api-client";

export interface MarkAllReadResponse {
   detail: string;
}

export const markAllNotificationsRead = async (): Promise<MarkAllReadResponse> => {
   const response = await api.post<MarkAllReadResponse>(
      "/orders/notifications/read-all/"
   );
   return response.data;
 };
