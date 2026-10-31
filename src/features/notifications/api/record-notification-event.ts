import { api } from "@/lib/api-client";
import { isEndpointUnavailable } from "@/lib/api-unavailable";
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
   if (isEndpointUnavailable("notifications")) {
      return { event_type: payload.event_type, notification: notificationId };
   }

   const response = await api.post<NotificationEventResponse>(
      `/orders/notifications/${notificationId}/events/`,
      payload
   );
   return response.data;
 };
