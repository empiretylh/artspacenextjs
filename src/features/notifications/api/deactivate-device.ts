import { api } from "@/lib/api-client";

export const deactivateNotificationDevice = async (
   token: string
): Promise<void> => {
   const encodedToken = encodeURIComponent(token);
   await api.delete(`/orders/notification-devices/${encodedToken}/`);
 };
