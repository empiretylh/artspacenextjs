"use client";

import { useEffect, useRef } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { env } from "@/config/env";
import { registerNotificationDevice } from "../api/register-device";
import { deactivateNotificationDevice } from "../api/deactivate-device";
import { recordNotificationEvent } from "../api/record-notification-event";
import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";

declare global {
   interface Window {
      median?: {
         firebaseMessaging?: {
            getToken: (options: { callback: (res: { token?: string }) => void }) => void;
            requestPermission?: (options: { callback: (res: { granted?: boolean }) => void }) => void;
            register?: (options: { callback: (res?: { token?: string; success?: boolean }) => void }) => void;
            deleteToken?: (options?: { callback?: (res: { success?: boolean }) => void }) => void;
            disableForegroundBanners?: () => void;
            notificationReceived?: {
               addListener: (cb: (payload: any) => void) => string;
               removeListener?: (id: string) => void;
            };
            notificationClicked?: {
               addListener: (cb: (payload: any) => void) => string;
               removeListener?: (id: string) => void;
            };
         };
      };
      MAS_APP_VERSION?: string;
   }
}

export const useNotificationDevice = () => {
   const { user, accessToken } = useAuth();
   const registeredTokenRef = useRef<string | null>(null);

   useEffect(() => {
      if (!user?.id || !accessToken) {
         if (registeredTokenRef.current) {
            deactivateNotificationDevice(registeredTokenRef.current).catch(console.warn);
            window.median?.firebaseMessaging?.deleteToken?.();
            registeredTokenRef.current = null;
         }
         return;
      }

      if (typeof window === "undefined") return;

      if (Capacitor.isNativePlatform()) {
         let registrationListener: { remove: () => Promise<void> } | undefined;
         let receivedListener: { remove: () => Promise<void> } | undefined;
         let clickedListener: { remove: () => Promise<void> } | undefined;

         const platform = Capacitor.getPlatform() === "ios" ? "IOS" : "ANDROID";
         const registerNativeToken = (token: string) => {
            registeredTokenRef.current = token;
            registerNotificationDevice({
               token,
               platform,
               app_version: window.MAS_APP_VERSION || "1.0.0",
            }).catch(console.warn);
         };

         const setupCapacitorPush = async () => {
            let permission = await PushNotifications.checkPermissions();
            if (permission.receive === "prompt") {
               permission = await PushNotifications.requestPermissions();
            }
            if (permission.receive !== "granted") return;

            registrationListener = await PushNotifications.addListener("registration", ({ value }) => {
               registerNativeToken(value);
            });
            receivedListener = await PushNotifications.addListener("pushNotificationReceived", (notification) => {
               const id = Number(notification.data?.notification_id ?? notification.data?.id);
               if (Number.isInteger(id) && id > 0) {
                  recordNotificationEvent(id, {
                     event_type: "RECEIVED",
                     metadata: { source: "CAPACITOR_PUSH" },
                  }).catch(console.warn);
               }
            });
            clickedListener = await PushNotifications.addListener("pushNotificationActionPerformed", ({ notification }) => {
               const id = Number(notification.data?.notification_id ?? notification.data?.id);
               if (Number.isInteger(id) && id > 0) {
                  recordNotificationEvent(id, {
                     event_type: "OPENED",
                     metadata: { source: "CAPACITOR_PUSH", web_route: notification.data?.web_route || "" },
                  }).catch(console.warn);
               }
               const route = notification.data?.web_route;
               if (route) window.location.assign(route);
            });

            await PushNotifications.register();
         };

         setupCapacitorPush().catch((error) => console.warn("Failed registering Capacitor push notifications:", error));

         return () => {
            registrationListener?.remove();
            receivedListener?.remove();
            clickedListener?.remove();
         };
      }

      // 1. Check if running inside Median shell
      if (window.median?.firebaseMessaging) {
         const medianMessaging = window.median.firebaseMessaging;
         let receivedListenerId: string | undefined;
         let clickedListenerId: string | undefined;

         const registerMedianToken = (token?: string) => {
            if (!token) return;

            const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
            registeredTokenRef.current = token;
            registerNotificationDevice({
               token,
               platform: isIos ? "IOS" : "ANDROID",
               app_version: window.MAS_APP_VERSION || "1.0.0",
            }).catch(console.warn);
         };

         const notificationId = (payload: any) => {
            const value = payload?.notification_id ?? payload?.id;
            const parsed = Number(value);
            return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
         };

         try {
            medianMessaging.disableForegroundBanners?.();

            receivedListenerId = medianMessaging.notificationReceived?.addListener((payload) => {
               const id = notificationId(payload);
               if (id) {
                  recordNotificationEvent(id, {
                     event_type: "RECEIVED",
                     metadata: { source: "MEDIAN_PUSH" },
                  }).catch(console.warn);
               }
            });

            clickedListenerId = medianMessaging.notificationClicked?.addListener((payload) => {
               const id = notificationId(payload);
               if (id) {
                  recordNotificationEvent(id, {
                     event_type: "OPENED",
                     metadata: { source: "MEDIAN_PUSH", web_route: payload?.web_route || "" },
                  }).catch(console.warn);
               }
            });

            medianMessaging.getToken({
               callback: async (result) => {
                  if (result?.token) return registerMedianToken(result.token);

                  // Median may require an explicit permission/register flow when
                  // automatic registration is disabled in App Studio.
                  medianMessaging.requestPermission?.({
                     callback: (permission) => {
                        if (!permission?.granted) return;
                        medianMessaging.register?.({
                           callback: (registration) => registerMedianToken(registration?.token),
                        });
                     },
                  });
               },
            });
         } catch (err) {
            console.warn("Failed registering device via Median bridge:", err);
         }

         return () => {
            if (receivedListenerId) medianMessaging.notificationReceived?.removeListener?.(receivedListenerId);
            if (clickedListenerId) medianMessaging.notificationClicked?.removeListener?.(clickedListenerId);
         };
      }

      // 2. Standard Web Browser FCM Registration
      const registerWebToken = async () => {
         if (!messaging || typeof Notification === "undefined") return;

         try {
            let permission = Notification.permission;
            if (permission === "default") {
               permission = await Notification.requestPermission();
            }

            if (permission === "granted") {
               const token = await getToken(messaging, {
                  vapidKey: env.FIREBASE_VAPID_KEY,
               });

               if (token && registeredTokenRef.current !== token) {
                  registeredTokenRef.current = token;
                  await registerNotificationDevice({
                     token,
                     platform: "WEB",
                     app_version: "1.0.0",
                  });
               }
            }
         } catch (error) {
            console.warn("Failed registering Web FCM notification device:", error);
         }
      };

      registerWebToken();
   }, [user?.id, accessToken]);
};
