import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals & static files
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Read auth cookie (adjust name)
  const token = request.cookies.get("artspace_refresh_token")?.value;
  const isAuthed = Boolean(token);

  // 1️⃣ Logged-in user visiting login page
  if (isAuthed && (pathname === "/sign-in" || pathname === "/sign-up")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 2️⃣ Guest visiting protected routes
  if (!isAuthed && (pathname.startsWith("/profile") || pathname.startsWith("/settings"))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 3️⃣ Everything else
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Exclude API routes, static files, image optimizations, and .png files
    '/((?!api|_next/static|_next/image|.*\\.png$).*)',
  ],
}
