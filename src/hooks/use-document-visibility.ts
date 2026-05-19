"use client";

import { useState, useEffect } from "react";
import { env } from "@/config/env";

/**
 * Hook to track the visibility state of the document.
 * Returns true if the document is visible, false otherwise.
 */
export const useDocumentVisibility = () => {
  const [isVisible, setIsVisible] = useState(
    typeof document !== "undefined" ? document.visibilityState === "visible" : true
  );

  useEffect(() => {
    // Debug log to confirm hook is active (Dev only)
    if (process.env.NODE_ENV === "development") {
      console.log(`[Visibility] Hook mounted. NODE_ENV: ${process.env.NODE_ENV}`);
    }

    const handleVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setIsVisible(visible);
      
      if (process.env.NODE_ENV === "development") {
        console.log(`[Visibility] Tab changed: ${visible ? "VISIBLE" : "HIDDEN"}`);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};
