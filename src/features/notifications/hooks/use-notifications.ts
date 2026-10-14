"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";
import type { AppNotification } from "@/types";
import { getNotifications } from "../api/get-notifications";
import { markNotificationRead } from "../api/mark-notification-read";
import { markAllNotificationsRead } from "../api/mark-all-notifications-read";
import { recordNotificationEvent } from "../api/record-notification-event";

export const useNotifications = () => {
   const { user } = useAuth();
   const queryClient = useQueryClient();

   const query = useQuery<AppNotification[]>({
      queryKey: queryKeys.notification.list(),
      queryFn: getNotifications,
      enabled: !!user?.id,
      staleTime: 1000 * 30, // 30 seconds
   });

   const notifications = query.data ?? [];
   const unreadNotifications = notifications.filter((n) => !n.is_read);
   const unreadCount = unreadNotifications.length;

   const markReadMutation = useMutation({
      mutationFn: async ({
         id,
         recordEvent = true,
      }: {
         id: number;
         recordEvent?: boolean;
      }) => {
         const res = await markNotificationRead(id);
         if (recordEvent) {
            recordNotificationEvent(id, {
               event_type: "OPENED",
               metadata: { source: "WEB_UI" },
            }).catch((err) => {
               console.warn("Failed to record OPENED event:", err);
            });
         }
         return res;
      },
      onMutate: async ({ id }) => {
         await queryClient.cancelQueries({
            queryKey: queryKeys.notification.list(),
         });
         const previous = queryClient.getQueryData<AppNotification[]>(
            queryKeys.notification.list()
         );

         queryClient.setQueryData<AppNotification[]>(
            queryKeys.notification.list(),
            (old = []) =>
               old.map((n) => (n.id === id ? { ...n, is_read: true } : n))
         );

         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous) {
            queryClient.setQueryData(
               queryKeys.notification.list(),
               context.previous
            );
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.notification.list(),
         });
      },
   });

   const markAllReadMutation = useMutation({
      mutationFn: markAllNotificationsRead,
      onMutate: async () => {
         await queryClient.cancelQueries({
            queryKey: queryKeys.notification.list(),
         });
         const previous = queryClient.getQueryData<AppNotification[]>(
            queryKeys.notification.list()
         );

         queryClient.setQueryData<AppNotification[]>(
            queryKeys.notification.list(),
            (old = []) => old.map((n) => ({ ...n, is_read: true }))
         );

         return { previous };
      },
      onError: (_err, _vars, context) => {
         if (context?.previous) {
            queryClient.setQueryData(
               queryKeys.notification.list(),
               context.previous
            );
         }
      },
      onSettled: () => {
         queryClient.invalidateQueries({
            queryKey: queryKeys.notification.list(),
         });
      },
   });

   return {
      ...query,
      notifications,
      unreadNotifications,
      unreadCount,
      markAsRead: markReadMutation.mutate,
      markAllAsRead: markAllReadMutation.mutate,
      isMarkingAllAsRead: markAllReadMutation.isPending,
   };
};
