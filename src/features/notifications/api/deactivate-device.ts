import { api } from "@/lib/api-client";
import { isEndpointUnavailable } from "@/lib/api-unavailable";

export const deactivateNotificationDevice = async (
   token: string
): Promise<void> => {
   if (isEndpointUnavailable("notificationDevices")) return;

   const encodedToken = encodeURIComponent(token);
   await api.delete(`/orders/notification-devices/${encodedToken}/`);
 };
