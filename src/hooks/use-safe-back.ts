'use client';

import { usePathname, useRouter } from "@/i18n/routing";
import { useEffect } from "react";

let historyCount = 0;

export function NavigationHistoryTracker() {
   const pathname = usePathname();

   useEffect(() => {
      historyCount++;
   }, [pathname]);

   return null;
}

/**
 * Hook for smart back navigation.
 * If the user has internal history within the current tab/session, it calls router.back()
 * (which preserves scroll position, filter state, and React Query cache).
 * Otherwise (cold load, direct URL, new tab, external referrer), it navigates safely
 * to the provided fallback path (default: '/artworks').
 */
export function useSafeBack(fallbackPath: string = "/artworks") {
   const router = useRouter();

   const goBack = () => {
      if (typeof window !== "undefined") {
         const hasInternalReferrer =
            document.referrer && document.referrer.startsWith(window.location.origin);

         if (historyCount > 1 || (hasInternalReferrer && window.history.length > 1)) {
            router.back();
            return;
         }
      }

      router.push(fallbackPath);
   };

   return {
      goBack,
      hasHistory: historyCount > 1,
   };
}
