"use client";

import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

import { env } from "@/config/env";

/**
 * True when the web app is running inside the Capacitor native shell
 * (Android/iOS) rather than a regular browser.
 */
export function isNativeApp(): boolean {
   return Capacitor.isNativePlatform();
}

let initialized = false;

/**
 * Initializes the native social-login plugin once. `webClientId` is the Google
 * "Web application" OAuth client ID (the same one used by @react-oauth/google);
 * `iOSClientId` is only required when running on iOS.
 */
async function ensureInitialized(): Promise<void> {
   if (initialized) return;

   await SocialLogin.initialize({
      google: {
         webClientId: env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
         iOSClientId: env.NEXT_PUBLIC_GOOGLE_IOS_CLIENT_ID,
         mode: "online",
      },
   });

   initialized = true;
}

/**
 * Runs the native Google Sign-In flow (Android Credential Manager / iOS
 * GoogleSignIn SDK) and returns the Google idToken expected by the backend.
 */
export async function signInWithGoogleNative(): Promise<string> {
   if (!isNativeApp()) {
      throw new Error("Native Google sign-in is only available in the app");
   }

   await ensureInitialized();

   const response = await SocialLogin.login({ provider: "google", options: {} });
   const result = response.result;

   if (result.responseType !== "online" || !result.idToken) {
      throw new Error("Google sign-in did not return an idToken");
   }

   return result.idToken;
}
