import { api } from "@/lib/api-client";
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
   const response = await api.post<RegisterDeviceResponse>(
      "/orders/notification-devices/",
      payload
   );
   return response.data;
 };
