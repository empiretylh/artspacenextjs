"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";

import { Button } from "@/components/ui/button";

import {
   signInWithAppleNative,
   type AppleNativeCredential,
} from "../lib/native-apple-auth";

type Props = {
   /** Receives the verified-ready credential from the native flow. */
   onCredential: (credential: AppleNativeCredential) => void | Promise<void>;
   /** Receives the failure reason so the UI can surface it. */
   onError?: (message?: string) => void;
   label?: string;
   disabled?: boolean;
};

/**
 * Sign in with Apple for the iOS shell only — it renders nothing elsewhere.
 * App Store Guideline 4.8 requires Apple's own sign-in option whenever another
 * third-party provider (Google) is offered, and the native ASAuthorization flow
 * needs no Services id. Web and Android are intentionally left without it:
 * there the same button would require a Services id, a return URL and a
 * server-side code exchange.
 */
export default function AppleAuthButton({
   onCredential,
   onError,
   label = "Sign in with Apple",
   disabled,
}: Props) {
   const [isIOS, setIsIOS] = useState(false);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      setIsIOS(Capacitor.getPlatform() === "ios");
   }, []);

   if (!isIOS) {
      return null;
   }

   const handleLogin = async () => {
      if (loading) return;
      try {
         setLoading(true);
         const credential = await signInWithAppleNative();
         await onCredential(credential);
      } catch (error) {
         console.error("Native Apple sign-in failed:", error);
         onError?.(error instanceof Error ? error.message : undefined);
      } finally {
         setLoading(false);
      }
   };

   return (
      <Button
         type="button"
         variant="outline"
         className="w-full"
         disabled={disabled || loading}
         onClick={handleLogin}
      >
         {loading ? "Signing in..." : label}
      </Button>
   );
}