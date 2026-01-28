import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Delete the refresh token cookie
  cookieStore.delete("artspace_refresh_token");

  // If you also stored user data in a separate cookie for SSR, delete that too
  cookieStore.delete("artspace_auth_session");

  return NextResponse.json({ success: true });
}
