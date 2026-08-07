import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip Next internals, static files, and APIs
  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Parse locale and locale-free pathname
  const pathnameParts = pathname.split("/").filter(Boolean);
  const hasLocale = pathnameParts.length > 0 && ["en", "my"].includes(pathnameParts[0]);
  const locale = hasLocale ? pathnameParts[0] : "en";
  const localeFreePathname = hasLocale ? "/" + pathnameParts.slice(1).join("/") : pathname;

  // Read auth cookie
  const token = request.cookies.get("artspace_refresh_token")?.value;
  const isAuthed = Boolean(token);

  // 1️⃣ Logged-in user visiting sign-in/sign-up page
  if (isAuthed && (localeFreePathname === "/sign-in" || localeFreePathname === "/sign-up")) {
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  // 2️⃣ Guest visiting protected routes
  if (
    !isAuthed &&
    (localeFreePathname.startsWith("/profile") ||
      localeFreePathname.startsWith("/settings") ||
      localeFreePathname.startsWith("/cart") ||
      localeFreePathname.startsWith("/checkout") ||
      localeFreePathname.startsWith("/orders") ||
      localeFreePathname.startsWith("/chats"))
  ) {
    return NextResponse.redirect(new URL(`/${locale}/sign-in`, request.url));
  }

  // 3️⃣ Landing page redirect (to /home) if user is authenticated or has explored
  // Removed redirect so all users see the landing page on root path.

  // Run next-intl localization routing
  return handleI18nRouting(request);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(my|en)/:path*",

    // Enable redirects for all paths except those that should be ignored (like api, _next/static, etc.)
    "/((?!api|_next|_vercel|.*\\..*).*)"
  ]
};
