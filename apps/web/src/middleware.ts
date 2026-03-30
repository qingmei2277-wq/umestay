import createMiddleware from "next-intl/middleware";
import { createUmestayServerClient } from "@umestay/db";
import { NextResponse } from "next/server";
import { routing } from "./navigation";
import type { NextRequest } from "next/server";

const PROTECTED_SEGMENTS = [
  "bookings",
  "account",
  "messages",
  "favorites",
  "payment",
  "reviews",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_SEGMENTS.some((seg) =>
    pathname.match(new RegExp(`/(zh|ja|en)/${seg}(/|$)`))
  );

  if (isProtected) {
    const supabase = createUmestayServerClient({
      getAll: () => request.cookies.getAll(),
      setAll: () => {}, // middleware 中只读
    });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      const locale = pathname.split("/")[1] ?? "zh";
      const loginUrl = new URL(`/${locale}/login`, request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return createMiddleware(routing)(request);
}

export const config = {
  matcher: [
    "/((?!_next|_vercel|auth|api|.*\\..*).*)",
    "/",
    "/(zh|ja|en)/:path*",
  ],
};
