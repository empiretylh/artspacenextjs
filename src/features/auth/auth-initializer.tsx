"use client";
import { useEffect, useRef } from "react";
import { useAuth } from "./store";
import { accessAnalytics, UserType } from "@/lib/analytics";
import { auth as firebaseAuth } from "@/features/service/firebase/firebase";
import { signInWithCustomToken, onAuthStateChanged } from "firebase/auth";
import { env } from "@/config/env";
import { getFirebaseChatToken } from "../service/artspace/get-firebase-chat-token";
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

        // 1. Initialize Zustand store with tokens
        useAuth.getState().init({
          user: data.user,
          accessToken: data.accessToken,
          firebaseToken: data.firebaseToken
        });

        // 2. Analytics
        if (data.user) {
          accessAnalytics.setUser(
            String(data.user.id),
            data.user.user_type.toLocaleLowerCase() as UserType
          );

          // 3. SILENT FIREBASE SYNC
          if (env.FIREBASE_ENABLE && firebaseAuth) {
            let token = data.firebaseToken;

            // If token is missing from session, fetch directly from Django backend
            if (!token && data.accessToken && !firebaseAuth.currentUser) {
              try {
                const fbRes = await getFirebaseChatToken();
                token = fbRes.firebase_token;
                useAuth.setState({ firebaseToken: token });
              } catch (tokenErr) {
                console.warn("Could not fetch firebase chat token from backend:", tokenErr);
              }
            }

            if (token && !firebaseAuth.currentUser) {
              try {
                await signInWithCustomToken(firebaseAuth, token);
                useAuth.getState().setFirebaseReady(true);
                syncProfile();
              } catch (signInErr) {
                // If token expired, attempt one refresh from backend
                try {
                  const fbRes = await getFirebaseChatToken();
                  token = fbRes.firebase_token;
                  useAuth.setState({ firebaseToken: token });
                  await signInWithCustomToken(firebaseAuth, token);
                  useAuth.getState().setFirebaseReady(true);
                  syncProfile();
                } catch (retryErr) {
                  console.error("Firebase sign-in with refreshed custom token failed:", retryErr);
                }
              }

              if (env.NODE_ENV === 'development') {
                console.log("Firebase session synced from auth initializer");
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
