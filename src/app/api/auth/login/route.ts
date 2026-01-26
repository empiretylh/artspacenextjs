import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

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

  // 2. Set the REFRESH TOKEN as an HttpOnly cookie (Invisible to JS)
  cookieStore.set("artspace_refresh_token", data.refresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  cookieStore.set("artspace_auth_session", JSON.stringify({ accessToken: data.access, user: data.user }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  // 3. Return the ACCESS TOKEN and USER to the frontend store
  return NextResponse.json({
    access: data.access,
    user: data.user,
  });
}
