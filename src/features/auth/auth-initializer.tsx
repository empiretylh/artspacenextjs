"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "./store";
import { accessAnalytics, UserType } from "@/lib/analytics";
import { auth as firebaseAuth } from "@/features/service/firebase/firebase"; // Your client config
import { signInWithCustomToken } from "firebase/auth";
import { env } from "@/config/env";

export function AuthInitializer() {
  const initialized = useRef(false);

  useEffect(() => {
    const sync = async () => {
      try {
        const res = await fetch('/api/auth/session');
        const data = await res.json();

        // 1. Initialize your Zustand store with all tokens
        useAuth.getState().init({
          user: data.user,
          accessToken: data.accessToken,
          firebaseToken: data.firebaseToken // Make sure your API returns this!
        });

        // 2. Analytics
        if (data.user) {
          accessAnalytics.setUser(
            String(data.user.id),
            data.user.user_type.toLocaleLowerCase() as UserType
          );

          // 3. SILENT FIREBASE SYNC
          // If we have a token and Firebase isn't already logged in
          if (env.FIREBASE_ENABLE && firebaseAuth && data.firebaseToken && !firebaseAuth.currentUser) {
            await signInWithCustomToken(firebaseAuth, data.firebaseToken);

            if (env.NODE_ENV === 'development') {
              console.log("Firebase session re-synced from auth initializer");
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    }

    if (!initialized.current) {
      sync();
      initialized.current = true;
    }
  }, []);

  return null;
}
