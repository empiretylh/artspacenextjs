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

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "").trim();

    if (!token) {
      return NextResponse.json(
        { error: "Missing authorization token" },
        { status: 401, headers: corsHeaders }
      );
    }

    // Forward Bearer token to Django to authenticate the user
    const djangoApiUrl = env.API_URL || "https://artspaceapi-stagging.illuminati.com.mm";
    const djangoRes = await fetch(`${djangoApiUrl.replace(/\/+$/, "")}/api/v1/users/profile/me/`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!djangoRes.ok) {
      return NextResponse.json(
        { error: "Invalid or expired session" },
        { status: 401, headers: corsHeaders }
      );
    }

    const userData = await djangoRes.json();
    if (!userData?.id) {
      return NextResponse.json(
        { error: "User identity could not be verified" },
        { status: 401, headers: corsHeaders }
      );
    }

    const verifiedUserId = String(userData.id);

    // Generate Firebase Custom Token for verified user ID
    const firebaseToken = await adminAuth.createCustomToken(verifiedUserId);

    return NextResponse.json(
      { firebaseToken },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("Firebase custom token generation error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal server error" },
      { status: 500, headers: corsHeaders }
    );
  }
}
