"use client";

import { useCallback, useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Network } from "@capacitor/network";

/**
 * Tracks device connectivity.
 *
 * Uses the native @capacitor/network plugin when running inside the native
 * shell (Android/iOS) and falls back to the browser `navigator.onLine` API on
 * the web. The initial value defaults to `true` so the UI never flashes the
 * offline state before the first status resolves.
 */
export function useNetworkStatus() {
   const [isOnline, setIsOnline] = useState(() =>
      typeof navigator === "undefined" ? true : navigator.onLine
   );
   const [isNative] = useState(() => Capacitor.isNativePlatform());

   const check = useCallback(async () => {
      if (isNative) {
         const status = await Network.getStatus();
         setIsOnline(status.connected);
         return status.connected;
      }

      const online = navigator.onLine;
      setIsOnline(online);
      return online;
   }, [isNative]);

   useEffect(() => {
      let mounted = true;
      let removeNativeListener: (() => void) | undefined;

      if (isNative) {
         Network.getStatus()
            .then((status) => mounted && setIsOnline(status.connected))
            .catch(() => {});

         Network.addListener("networkStatusChange", (status) => {
            if (mounted) setIsOnline(status.connected);
         }).then((handle) => {
            removeNativeListener = () => handle.remove();
         });
      } else {
         const onOnline = () => mounted && setIsOnline(true);
         const onOffline = () => mounted && setIsOnline(false);

         window.addEventListener("online", onOnline);
         window.addEventListener("offline", onOffline);

         return () => {
            mounted = false;
            window.removeEventListener("online", onOnline);
            window.removeEventListener("offline", onOffline);
         };
      }

      return () => {
         mounted = false;
         removeNativeListener?.();
      };
   }, [isNative]);

   return { isOnline, isNative, check };
}
