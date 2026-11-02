// app/api/auth/refresh/route.ts
import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getMinimalUser } from "@/lib/auth";

// Kept in sync with the backend JWT lifetime (365 days).
const SESSION_MAX_AGE = 60 * 60 * 24 * 365;

const sessionCookieOptions = {
  maxAge: SESSION_MAX_AGE,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

function readSession(raw: string | undefined) {
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    // Cookie values can still be percent-encoded depending on the writer.
    try {
      return JSON.parse(decodeURIComponent(raw));
    } catch {
      return {};
    }
  }
}

function clearSession(cookieStore: Awaited<ReturnType<typeof cookies>>) {
  cookieStore.delete("artspace_refresh_token");
  cookieStore.delete("artspace_auth_session");
}

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("artspace_refresh_token")?.value;

  if (!refreshToken) {
    // Nothing to refresh with: this is a genuine signed-out state.
    clearSession(cookieStore);
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  let response: Response;
  try {
    response = await fetch(env.API_URL + "/api/v1/users/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });
  } catch {
    // Network/DNS/timeout: the backend may be briefly unreachable. Never destroy
    // a valid session because of a transport failure.
    return NextResponse.json({ message: "Auth service unavailable" }, { status: 503 });
  }

  if (response.status === 401 || response.status === 403) {
    // Backend explicitly rejected the refresh token (expired/revoked).
    clearSession(cookieStore);
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }

  let data: { access?: string; refresh?: string } = {};
  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok || !data.access) {
    // 5xx or unexpected payload: treat as temporary, keep cookies intact.
    return NextResponse.json({ message: "Auth service unavailable" }, { status: 503 });
  }

  const authSession = readSession(cookieStore.get("artspace_auth_session")?.value);

  // A valid refresh token means the user is signed in even if the readable
  // session cookie was lost or corrupted, so rebuild the user before writing it.
  if (!authSession.user) {
    try {
      const meRes = await fetch(env.API_URL + "/api/v1/users/profile/me/", {
        headers: { Authorization: `Bearer ${data.access}` },
      });
      if (meRes.ok) {
        authSession.user = getMinimalUser(await meRes.json());
      }
    } catch {
      // Keep the existing cookie contents if the profile lookup fails.
    }
  }

  cookieStore.set(
    "artspace_auth_session",
    JSON.stringify({ ...authSession, accessToken: data.access }),
    { ...sessionCookieOptions, httpOnly: false },
  );

  // SimpleJWT rotates refresh tokens (ROTATE_REFRESH_TOKENS), so persist the
  // new one to keep the session sliding forward.
  if (data.refresh) {
    cookieStore.set("artspace_refresh_token", data.refresh, {
      ...sessionCookieOptions,
      httpOnly: true,
    });
  }

  return NextResponse.json({ access: data.access });
}
