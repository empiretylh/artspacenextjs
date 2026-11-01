"use client";

import { Capacitor } from "@capacitor/core";
import { SocialLogin } from "@capgo/capacitor-social-login";

export type AppleNativeCredential = {
   /** Apple identity token (JWT); the backend verifies it against Apple's JWKS. */
   idToken: string;
   /** Unhashed nonce, so the backend can re-hash and bind the token to this attempt. */
   nonce: string;
   firstName: string;
   lastName: string;
};

function toBase64Url(bytes: Uint8Array): string {
   return btoa(String.fromCharCode(...bytes))
      .replaceAll("+", "-")
      .replaceAll("/", "_")
      .replace(/=+$/, "");
}

async function sha256Base64Url(value: string): Promise<string> {
   const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(value)
   );

   return toBase64Url(new Uint8Array(digest));
}

/**
 * Runs the native iOS Sign in with Apple flow and returns the identity token the
 * backend expects. The plugin writes the `nonce` option straight onto
 * `ASAuthorizationAppleIDRequest.nonce`, which Apple requires to already be the
 * SHA-256 hash, so the raw value is kept here and handed to the backend instead.
 *
 * Names are only present on a person's first authorization; afterwards they come
 * back empty and the stored profile is used.
 */
export async function signInWithAppleNative(): Promise<AppleNativeCredential> {
   if (Capacitor.getPlatform() !== "ios") {
      throw new Error("Native Apple sign-in is only available on iOS");
   }

   const nonce = toBase64Url(crypto.getRandomValues(new Uint8Array(32)));

   const response = await SocialLogin.login({
      provider: "apple",
      options: { nonce: await sha256Base64Url(nonce) },
   });

   const result = response.result;

   if (!result.idToken) {
      throw new Error("Apple sign-in did not return an identity token");
   }

   return {
      idToken: result.idToken,
      nonce,
      firstName: result.profile?.givenName ?? "",
      lastName: result.profile?.familyName ?? "",
   };
}