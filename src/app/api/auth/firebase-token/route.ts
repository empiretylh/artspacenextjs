import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";
import { env } from "@/config/env";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: corsHeaders,
  });
}

async function handleFirebaseTokenRequest(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401, headers: corsHeaders }
      );
    }

    const djangoApiUrl = (env.API_URL || "https://artspaceapi-stagging.illuminati.com.mm").replace(/\/+$/, "");

    // 1. Primary: Request Firebase Custom Token directly from Django backend
    try {
      const djangoRes = await fetch(`${djangoApiUrl}/api/v1/users/chat/firebase-token/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (djangoRes.ok) {
        const data = await djangoRes.json();
        return NextResponse.json(
          {
            firebaseToken: data.firebase_token,
            firebase_token: data.firebase_token,
            uid: data.uid,
            expires_in: data.expires_in,
          },
          { status: 200, headers: corsHeaders }
        );
      }

      if (djangoRes.status === 401) {
        return NextResponse.json(
          { error: "Invalid or expired session" },
          { status: 401, headers: corsHeaders }
        );
      }
    } catch (backendError) {
      console.warn("Backend chat token request failed, checking fallback:", backendError);
    }

    // 2. Fallback: If Django chat token endpoint is unconfigured (503/500) but local adminAuth is available
    if (adminAuth) {
      const profileRes = await fetch(`${djangoApiUrl}/api/v1/users/profile/me/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (profileRes.ok) {
        const userData = await profileRes.json();
        if (userData?.id) {
          const verifiedUserId = String(userData.id);
          const firebaseToken = await adminAuth.createCustomToken(verifiedUserId);
          return NextResponse.json(
            {
              firebaseToken,
              firebase_token: firebaseToken,
              uid: verifiedUserId,
              expires_in: 3600,
            },
            { status: 200, headers: corsHeaders }
          );
        }
      }
    }

    return NextResponse.json(
      { error: "Could not create chat token" },
      { status: 500, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Firebase custom token generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function GET(req: NextRequest) {
  return handleFirebaseTokenRequest(req);
}

export async function POST(req: NextRequest) {
  return handleFirebaseTokenRequest(req);
}
