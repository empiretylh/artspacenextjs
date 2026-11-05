// app/api/auth/session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { env } from "@/config/env";

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
    console.warn("Failed to initialize Firebase Admin SDK in session route:", error);
  }
}

export async function GET() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get("artspace_auth_session")?.value;

  if (!authSession) {
    return NextResponse.json({ user: null, accessToken: null });
  }

  // Generate a fresh token so the frontend doesn't use an expired one

  try {
    const data = JSON.parse(authSession);
    let firebaseToken = "";
    if (env.FIREBASE_ENABLE) {
      if (data.accessToken) {
        try {
          const fbRes = await fetch(`${env.API_URL}/api/v1/users/chat/firebase-token/`, {
            headers: { Authorization: `Bearer ${data.accessToken}` },
          });
          if (fbRes.ok) {
            const fbData = await fbRes.json();
            firebaseToken = fbData.firebase_token || "";
          }
        } catch (fbErr) {
          console.warn("Backend Firebase token fetch failed in session, trying local fallback:", fbErr);
        }
      }

      if (!firebaseToken && admin.apps.length && data.user?.id) {
        try {
          firebaseToken = await admin.auth().createCustomToken(String(data.user.id));
        } catch (error) {
          console.error("Firebase local token fallback failed in session:", error);
        }
      }
    }
    return NextResponse.json({
      user: data.user,
      accessToken: data.accessToken,
      firebaseToken: firebaseToken,
    });
  } catch {
    return NextResponse.json({ user: null, accessToken: null, firebaseToken: null }, { status: 400 });
  }
}
