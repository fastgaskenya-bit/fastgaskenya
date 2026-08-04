import { NextResponse } from "next/server";

// Gates the analytics dashboard behind a cookie. Cookie is set by
// /api/admin/login after the password matches ADMIN_PASSWORD env var.
export function middleware(req) {
  const { pathname } = req.nextUrl;

  // /api/admin/cleanup handles its own auth (cookie OR cron secret) so Vercel
  // Cron can hit it without needing a login cookie.
  const needsAuth =
    pathname.startsWith("/admin/analytics") ||
    pathname.startsWith("/api/admin/analytics") ||
    pathname.startsWith("/api/admin/session");

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("fg_admin")?.value;
  const expected = process.env.ADMIN_PASSWORD || "";

  if (token && expected && token === expected) return NextResponse.next();

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin/analytics/:path*",
    "/api/admin/analytics/:path*",
    "/api/admin/session/:path*",
  ],
};
