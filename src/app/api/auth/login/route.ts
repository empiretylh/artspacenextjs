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
  const { email, password } = await request.json();
  const cookieStore = await cookies();

  // 1. Call your real backend
  const res = await fetch(env.API_URL + "/api/v1/users/auth/login/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // credentials: 'omit',
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  // --- NEW: FIREBASE HANDSHAKE ---
  // 2. Generate a Firebase Custom Token using the User ID from your real backend
  let firebaseToken = "";
  try {
    // We use data.user.id (or whatever your backend calls the unique user ID)
    if (env.FIREBASE_ENABLE) firebaseToken = await admin.auth().createCustomToken(String(data.user.id));
  } catch (error) {
    console.error("Firebase token generation failed:", error);
  }

  // 3. Set your existing cookies
  cookieStore.set("artspace_refresh_token", data.refresh, { httpOnly: true });
  cookieStore.set("artspace_auth_session", JSON.stringify({
    accessToken: data.access,
    user: data.user
  }), { httpOnly: false });

  // 4. Return EVERYTHING to the frontend, including the Firebase token
  return NextResponse.json({
    access: data.access,
    user: data.user,
    firebaseToken: firebaseToken, // <-- Pass this to the client
  });
}
