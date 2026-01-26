// app/api/auth/refresh/route.ts
import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("artspace_refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  try {
    // Call your REAL backend
    const response = await fetch(env.API_URL + "/api/v1/users/auth/token/refresh/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    const data = await response.json();

    if (!response.ok) throw new Error();

    // If your backend rotates refresh tokens, update the cookie here
    if (data.access) {
      const authSession = JSON.parse(cookieStore.get("artspace_auth_session")?.value || "{}");

      cookieStore.set("artspace_auth_session", JSON.stringify({ ...authSession, accessToken: data.access }), {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
      });
    }

    return NextResponse.json({ access: data.access });
  } catch (error) {
    cookieStore.delete("refresh_token");
    return NextResponse.json({ message: "Session expired" }, { status: 401 });
  }
}
