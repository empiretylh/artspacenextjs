import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import admin from "firebase-admin";

// Initialize Admin SDK (Ensures it only initializes once)
const privateKey = env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

if (!admin.apps.length && env.FIREBASE_ENABLE) {
  admin.initializeApp({
    projectId: env.FIREBASE_PROJECT_ID,
    storageBucket: env.FIREBASE_STORAGE_BUCKET,
    credential: admin.credential.cert({
      projectId: env.FIREBASE_PROJECT_ID,
      clientEmail: env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

export async function POST(request: Request) {
  const { token } = await request.json();
  const cookieStore = await cookies();

  console.log(token)

  // 1. Call real backend for Google authentication
  // Endpoint: {{domain}}/api/v1/users/auth/google/
  const res = await fetch(env.API_URL + "/api/v1/users/auth/google/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  console.log(res)

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  // --- FIREBASE HANDSHAKE ---
  // 2. Generate a Firebase Custom Token using the User ID from the backend
  let firebaseToken = "";
  try {
    if (env.FIREBASE_ENABLE) {
      firebaseToken = await admin.auth().createCustomToken(String(data.user.id));
    }
  } catch (error) {
    console.error("Firebase token generation failed:", error);
  }

  // 3. Set cookies
  // Refresh token is HttpOnly for security
  cookieStore.set("artspace_refresh_token", data.refresh, { httpOnly: true });
  // Session data (access token + user) is non-HttpOnly for client-side access
  cookieStore.set("artspace_auth_session", JSON.stringify({
    accessToken: data.access,
    user: data.user
  }), { httpOnly: false });

  // 4. Return to frontend
  return NextResponse.json({
    access: data.access,
    user: data.user,
    firebaseToken: firebaseToken,
  });
}
