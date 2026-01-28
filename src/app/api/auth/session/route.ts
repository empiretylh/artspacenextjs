// app/api/auth/session/route.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  const cookieStore = await cookies();
  const authSession = cookieStore.get("artspace_auth_session")?.value;

  if (!authSession) {
    return NextResponse.json({ user: null, accessToken: null });
  }

  try {
    const data = JSON.parse(authSession);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ user: null, accessToken: null }, { status: 400 });
  }
}
