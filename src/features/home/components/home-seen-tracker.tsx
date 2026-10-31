"use client";

import { useEffect } from "react";
import { setHasSeenHome } from "@/lib/home-seen";

/**
 * Headless client tracker that marks the home page as seen upon mounting.
 */
export function HomeSeenTracker() {
  useEffect(() => {
    setHasSeenHome();
  }, []);

  return null;
}
