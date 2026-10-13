"use client";

import { useEffect, useRef } from "react";
import { getToken } from "firebase/messaging";
import { messaging } from "@/features/service/firebase/firebase";
import { useAuth } from "@/features/auth/store";
import { env } from "@/config/env";
import { registerNotificationDevice } from "../api/register-device";
import { deactivateNotificationDevice } from "../api/deactivate-device";

declare global {
   interface Window {
      median?: {
         firebaseMessaging?: {
            getToken: (options: { callback: (res: { token?: string }) => void }) => void;
            requestPermission?: (options: { callback: (res: { granted?: boolean }) => void }) => void;
            register?: (options: { callback: () => void }) => void;
            deleteToken?: () => void;
            disableForegroundBanners?: () => void;
            notificationReceived?: {
               addListener: (cb: (payload: any) => void) => string;
            };
            notificationClicked?: {
               addListener: (cb: (payload: any) => void) => string;
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
            registeredTokenRef.current = null;
         }
         return;
      }

      if (typeof window === "undefined") return;

      // 1. Check if running inside Median shell
      if (window.median?.firebaseMessaging) {
         try {
            window.median.firebaseMessaging.disableForegroundBanners?.();
            window.median.firebaseMessaging.getToken({
               callback: async (result) => {
                  if (result?.token) {
                     const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
                     const platform = isIos ? "IOS" : "ANDROID";
                     const token = result.token;
                     registeredTokenRef.current = token;

                     await registerNotificationDevice({
                        token,
                        platform,
                        app_version: window.MAS_APP_VERSION || "1.0.0",
                     }).catch(console.warn);
                  }
               },
            });
         } catch (err) {
            console.warn("Failed registering device via Median bridge:", err);
         }
         return;
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
