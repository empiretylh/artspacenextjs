import { env } from "@/config/env";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const cookieStore = await cookies();

  try {
    // 1. Call your real backend register endpoint
    const res = await fetch(env.API_URL + "/api/v1/users/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    // 2. Set the secure cookies (assuming register returns the same as login)
    // cookieStore.set("refresh_token", data.refresh, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: "lax",
    //   path: "/",
    // });

    // 3. Return user data and access token to Zustand
    return NextResponse.json(data);
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "Registration failed" }, { status: 500 });
  }
}
