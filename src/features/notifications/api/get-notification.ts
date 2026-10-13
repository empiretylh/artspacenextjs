import { api } from "@/lib/api-client";
import type { AppNotification } from "@/types";

export const getNotification = async (
   id: number
): Promise<AppNotification> => {
   const response = await api.get<AppNotification>(
      `/orders/notifications/${id}/`
   );
   return response.data;
 };
