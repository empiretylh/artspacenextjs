import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { getMinimalUser } from "@/lib/auth";

// Initialize Admin SDK only when valid credentials are provided
const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const hasAdminCredentials = Boolean(
  env.FIREBASE_PROJECT_ID &&
  env.FIREBASE_CLIENT_EMAIL &&
  privateKey
);

if (!admin.apps.length && env.FIREBASE_ENABLE && hasAdminCredentials) {
  try {
    admin.initializeApp({
      projectId: env.FIREBASE_PROJECT_ID,
      storageBucket: env.FIREBASE_STORAGE_BUCKET,
      credential: admin.credential.cert({
        projectId: env.FIREBASE_PROJECT_ID,
        clientEmail: env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin SDK in apple route:", error);
  }
}

export async function POST(request: Request) {
  const { token, nonce, first_name: firstName, last_name: lastName } = await request.json();
  const cookieStore = await cookies();

  // 1. Call real backend for Apple identity-token verification
  // Endpoint: {{domain}}/api/v1/users/auth/apple/
  const res = await fetch(env.API_URL + "/api/v1/users/auth/apple/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      token,
      nonce,
      first_name: firstName,
      last_name: lastName,
    }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  // --- FIREBASE HANDSHAKE ---
  // 2. Fetch Firebase Custom Token from Django backend (with local Admin SDK fallback)
  let firebaseToken = "";
  if (env.FIREBASE_ENABLE) {
    try {
      if (data.access) {
        const fbRes = await fetch(`${env.API_URL}/api/v1/users/chat/firebase-token/`, {
          headers: { Authorization: `Bearer ${data.access}` },
        });
        if (fbRes.ok) {
          const fbData = await fbRes.json();
          firebaseToken = fbData.firebase_token || "";
        }
      }
    } catch (fbErr) {
      console.warn("Backend Firebase token fetch failed, trying local fallback:", fbErr);
    }

    if (!firebaseToken && admin.apps.length && data.user?.id) {
      try {
        firebaseToken = await admin.auth().createCustomToken(String(data.user.id));
      } catch (error) {
        console.error("Firebase local token fallback failed:", error);
      }
    }
  }

  // 3. Set persistent cookies so the WebView survives force-close/reopen.
  // Kept in sync with the backend JWT lifetime (365 days) so the session only
  // ends when the user taps Logout.
  const cookieOptions = {
    maxAge: 60 * 60 * 24 * 365,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  };
  // Refresh token is HttpOnly for security.
  cookieStore.set("artspace_refresh_token", data.refresh, { ...cookieOptions, httpOnly: true });
  // Session data (access token + user) is non-HttpOnly for client-side access
  cookieStore.set("artspace_auth_session", JSON.stringify({
    accessToken: data.access,
    user: getMinimalUser(data.user)
  }), { ...cookieOptions, httpOnly: false });

  // 4. Return to frontend
  return NextResponse.json({
    access: data.access,
    user: data.user,
    firebaseToken: firebaseToken,
  });
}
