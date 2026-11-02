import { api } from "@/lib/api-client";
import { isEndpointUnavailable } from "@/lib/api-unavailable";
import type { NotificationDevicePayload } from "@/types";

export interface RegisterDeviceResponse {
   id?: number;
   token: string;
   platform: string;
   app_version?: string;
   is_active?: boolean;
}

export const registerNotificationDevice = async (
   payload: NotificationDevicePayload
): Promise<RegisterDeviceResponse> => {
   if (isEndpointUnavailable("notificationDevices")) {
      return { token: payload.token, platform: payload.platform };
   }

   const response = await api.post<RegisterDeviceResponse>(
      "/orders/notification-devices/",
      payload
   );
   return response.data;
 };
