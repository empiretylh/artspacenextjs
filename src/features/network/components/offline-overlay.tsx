"use client";

import { useState } from "react";
import Image from "next/image";
import { RotateCw, WifiOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNetworkStatus } from "../hooks/use-network-status";

/**
 * Full-screen offline state rendered inside the native WebView.
 *
 * Only shown on the native platform; the public website keeps its normal
 * experience when the browser reports no connection.
 */
export function OfflineOverlay() {
   const { isOnline, isNative, check } = useNetworkStatus();
   const [retrying, setRetrying] = useState(false);

   const handleRetry = async () => {
      setRetrying(true);
      const online = await check();
      if (online) {
         window.location.reload();
         return;
      }
      setTimeout(() => setRetrying(false), 600);
   };

   if (isOnline || !isNative) return null;

   return (
      <div
         role="alertdialog"
         aria-label="No internet connection"
         className="bg-background fixed inset-0 z-[9999] flex flex-col items-center justify-center gap-6 px-6 text-center"
      >
         <Image
            src="/assets/logo.png"
            alt="Myanmar Art Space"
            width={1080}
            height={1080}
            priority
            className="h-auto w-24"
         />

         <div className="bg-muted flex size-20 items-center justify-center rounded-full">
            <WifiOff className="text-muted-foreground size-9" strokeWidth={1.75} />
         </div>

         <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">No Internet Connection</h2>
            <p className="text-muted-foreground max-w-xs text-sm">
               Please check your connection and try again.
            </p>
         </div>

         <Button
            onClick={handleRetry}
            loading={retrying}
            size="lg"
            className="mt-2 gap-2 rounded-lg px-8"
         >
            {!retrying && <RotateCw className="size-4" />}
            Try Again
         </Button>
      </div>
   );
}
