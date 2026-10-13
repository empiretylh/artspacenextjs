import { api } from "@/lib/api-client";

export interface MarkReadResponse {
   id: number;
   is_read: boolean;
   created_at: string;
}

export const markNotificationRead = async (
   id: number
): Promise<MarkReadResponse> => {
   const response = await api.post<MarkReadResponse>(
      `/orders/notifications/${id}/read/`
   );
   return response.data;
 };
