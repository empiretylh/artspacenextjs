"use client";

import React, { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { env } from "@/config/env";
import { queryKeys } from "@/config/query-keys";
import { useAuth } from "@/features/auth/store";
import type { AppNotification } from "@/types";
import { toast } from "sonner";
import { Bell } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import Cookies from "js-cookie";
import { recordNotificationEvent } from "../api/record-notification-event";

export const useNotificationStream = () => {
   const { accessToken: stateToken, user } = useAuth();
   const queryClient = useQueryClient();
   const router = useRouter();
   const abortControllerRef = useRef<AbortController | null>(null);

   const cookieData = typeof window !== "undefined" 
      ? JSON.parse(Cookies.get("artspace_auth_session") || "{}") 
      : {};
   const accessToken = stateToken || cookieData.accessToken;

   useEffect(() => {
      if (!accessToken || !user?.id) {
         abortControllerRef.current?.abort();
         return;
      }

      let isMounted = true;
      let retryDelay = 1000;
      let timeoutId: NodeJS.Timeout | null = null;

      const connectStream = async () => {
         if (!isMounted) return;

         abortControllerRef.current?.abort();
         const controller = new AbortController();
         abortControllerRef.current = controller;

         try {
            const streamUrl = `${env.API_URL}/api/v1/orders/notifications/stream/`;
            console.log("[NotificationStream] Connecting to SSE stream:", streamUrl);
            const response = await fetch(streamUrl, {
               headers: {
                  Authorization: `Bearer ${accessToken}`,
                  Accept: "text/event-stream, */*",
               },
               signal: controller.signal,
            });

            if (!response.ok) {
               console.error(`[NotificationStream] Failed with status ${response.status} ${response.statusText}`);
               throw new Error(`Notification stream failed: ${response.status}`);
            }

            console.log("[NotificationStream] Connected successfully to SSE stream");
            // Successfully connected - reset retry delay
            retryDelay = 1000;

            // Re-fetch notifications to recover any missed events during disconnect
            queryClient.invalidateQueries({
               queryKey: queryKeys.notification.list(),
            });

            if (!response.body) {
               console.warn("[NotificationStream] Response has no body stream");
               return;
            }

            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";

            while (isMounted) {
               const { value, done } = await reader.read();
               if (done) break;

               buffer += decoder.decode(value, { stream: true });
               const events = buffer.split(/\r?\n\r?\n/);
               buffer = events.pop() || "";

               for (const eventText of events) {
                  if (!eventText.trim()) continue;
                  console.log("[NotificationStream] Event chunk received:", eventText);

                  const dataLine = eventText
                     .split(/\r?\n/)
                     .find((line) => line.startsWith("data:"));

                  if (dataLine) {
                     try {
                        const rawData = dataLine.replace(/^data:\s*/, "").trim();
                        const notification: AppNotification = JSON.parse(rawData);
                        console.log("[NotificationStream] Notification parsed:", notification);

                        // 1. Prepend to React Query Cache
                        queryClient.setQueryData<AppNotification[]>(
                           queryKeys.notification.list(),
                           (old = []) => {
                              const list = Array.isArray(old) ? old : [];
                              const exists = list.some((n) => n.id === notification.id);
                              if (exists) return list;
                              return [notification, ...list];
                           }
                        );
                        queryClient.invalidateQueries({
                           queryKey: queryKeys.notification.list(),
                        });

                        // 2. Report SSE_RECEIVED analytics
                        recordNotificationEvent(notification.id, {
                           event_type: "SSE_RECEIVED",
                           metadata: { source: "WEB_SSE" },
                        }).catch((err) => {
                           console.warn("Failed to report SSE_RECEIVED:", err);
                        });

                        // 3. Display Toast
                        toast(notification.title, {
                           description: notification.message,
                           icon: React.createElement(Bell, { className: "w-4 h-4 text-primary" }),
                           action: notification.web_route
                              ? {
                                   label: "View",
                                   onClick: () => {
                                      router.push(notification.web_route as any);
                                   },
                                }
                              : undefined,
                        });
                     } catch (err) {
                        console.error("Failed to parse SSE notification payload:", err);
                     }
                  }
               }
            }
         } catch (error: any) {
            if (error.name === "AbortError" || !isMounted) {
               return;
            }

            console.warn(`SSE Notification connection closed. Retrying in ${retryDelay}ms...`);
            timeoutId = setTimeout(() => {
               if (isMounted) {
                  connectStream();
               }
            }, retryDelay);
            retryDelay = Math.min(retryDelay * 2, 30000);
         }
      };

      connectStream();

      return () => {
         isMounted = false;
         abortControllerRef.current?.abort();
         if (timeoutId) clearTimeout(timeoutId);
      };
   }, [accessToken, user?.id, queryClient, router]);
};
