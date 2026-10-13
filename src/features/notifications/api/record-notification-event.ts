import { api } from "@/lib/api-client";
import type { NotificationEventPayload } from "@/types";

export interface NotificationEventResponse {
   id?: number;
   notification?: number;
   event_type: string;
   created_at?: string;
}

export const recordNotificationEvent = async (
   notificationId: number,
   payload: NotificationEventPayload
): Promise<NotificationEventResponse> => {
   const response = await api.post<NotificationEventResponse>(
      `/orders/notifications/${notificationId}/events/`,
      payload
   );
   return response.data;
 };
