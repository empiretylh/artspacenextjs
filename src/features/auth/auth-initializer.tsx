"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "./store";
import { accessAnalytics, UserType } from "@/lib/analytics";
import { auth as firebaseAuth } from "@/features/service/firebase/firebase"; // Your client config
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { env } from "@/config/env";
import { useSyncUserProfile } from "../chat/hooks/use-sync-user-profile";
import { usePresence } from "../chat/hooks/use-presence";

export function AuthInitializer() {
  const initialized = useRef(false);
  const { syncProfile } = useSyncUserProfile();
  usePresence();

  // 1. Reactive Firebase Auth State Listener
  useEffect(() => {
    if (!env.FIREBASE_ENABLE || !firebaseAuth) {
      useAuth.getState().setFirebaseReady(true);
      return;
    }

    const unsubscribe = onAuthStateChanged(firebaseAuth, (firebaseUser) => {
      const currentUser = useAuth.getState().user;
      if (firebaseUser && currentUser?.id && firebaseUser.uid === String(currentUser.id)) {
        useAuth.getState().setFirebaseReady(true);
      } else if (!firebaseUser) {
        useAuth.getState().setFirebaseReady(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // 2. Initial Handshake & Silent Firebase Sync
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
          if (env.FIREBASE_ENABLE && firebaseAuth) {
            if (data.firebaseToken && !firebaseAuth.currentUser) {
              await signInWithCustomToken(firebaseAuth, data.firebaseToken);
              useAuth.getState().setFirebaseReady(true);
              syncProfile();

              if (env.NODE_ENV === 'development') {
                console.log("Firebase session re-synced from auth initializer");
              }
            } else if (firebaseAuth.currentUser && firebaseAuth.currentUser.uid === String(data.user.id)) {
              useAuth.getState().setFirebaseReady(true);
              syncProfile();
            }
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
      }
    };

    if (!initialized.current) {
      sync();
      initialized.current = true;
    }
  }, [syncProfile]);

  return null;
}
