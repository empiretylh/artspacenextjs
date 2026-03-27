// app/api/auth/session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import admin from "firebase-admin";
import { env } from "@/config/env";

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
    if (env.FIREBASE_ENABLE && data.user?.id) {
      firebaseToken = await admin.auth().createCustomToken(String(data.user.id));
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
