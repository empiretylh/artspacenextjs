"use client";

import { useEffect, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { GoogleLogin } from "@react-oauth/google";

import GoogleIcon from "@/components/icons/google-icon";
import { Button } from "@/components/ui/button";

import { signInWithGoogleNative } from "../lib/native-google-auth";

type Props = {
   /** Receives the Google idToken from either the native or the web flow. */
   onIdToken: (idToken: string) => void | Promise<void>;
   onError?: () => void;
   label: string;
   disabled?: boolean;
};

/**
 * Google sign-in control that adapts to the platform:
 * - Web: renders the Google Identity Services button (@react-oauth/google).
 * - Native (Capacitor): renders a button that triggers the native Google
 *   Sign-In flow, avoiding the external-browser popup problem.
 */
export default function GoogleAuthButton({
   onIdToken,
   onError,
   label,
   disabled,
}: Props) {
   const [isNative, setIsNative] = useState(false);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      setIsNative(Capacitor.isNativePlatform());
   }, []);

   const handleNativeLogin = async () => {
      if (loading) return;
      try {
         setLoading(true);
         const idToken = await signInWithGoogleNative();
         await onIdToken(idToken);
      } catch (error) {
         console.error("Native Google sign-in failed:", error);
         onError?.();
      } finally {
         setLoading(false);
      }
   };

   if (!isNative) {
      return (
         <GoogleLogin
            onSuccess={(response) => {
               if (response.credential) {
                  void onIdToken(response.credential);
               }
            }}
            onError={onError}
            useOneTap
            theme="outline"
            shape="rectangular"
            width="100%"
         />
      );
   }

   return (
      <Button
         type="button"
         variant="outline"
         className="w-full"
         disabled={disabled || loading}
         onClick={handleNativeLogin}
      >
         <GoogleIcon size={18} />
         {loading ? "Signing in..." : label}
      </Button>
   );
}
