"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { getHasSeenHome, setHasSeenHome } from "@/lib/home-seen";

/**
 * Client-side guard for the root home route:
 * - If the client already has 'artspace_home_seen' (e.g. in localStorage),
 *   redirects immediately to '/artworks'.
 * - Otherwise, marks the home page as seen.
 */
export function RootHomeClientGate() {
  const router = useRouter();

  useEffect(() => {
    if (getHasSeenHome()) {
      router.replace("/artworks");
    } else {
      setHasSeenHome();
    }
  }, [router]);

  return null;
}
