import { NextResponse } from "next/server";
import { COUNTRY_CODES, countryFromHost } from "./lib/countries";

// Paths that must never be rewritten under a country segment.
const PASSTHROUGH = [
  "/api",
  "/admin",
  "/_next",
  "/sitemap.xml",
  "/robots.txt",
  "/icon.svg",
  "/favicon.ico",
];

function isPassthrough(pathname) {
  return PASSTHROUGH.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

// Vanity paths kept from the previous single-country setup.
const VANITY = {
  "/all-in-one-bundle": "/products/all-in-one-bundle",
};

function adminAuth(req, pathname) {
  // /api/admin/cleanup handles its own auth (cookie OR cron secret) so Vercel
  // Cron can hit it without needing a login cookie.
  const needsAuth =
    pathname.startsWith("/admin/analytics") ||
    pathname.startsWith("/api/admin/analytics") ||
    pathname.startsWith("/api/admin/session");

  if (!needsAuth) return null;

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

export function middleware(req) {
  const { pathname } = req.nextUrl;

  const authResponse = adminAuth(req, pathname);
  if (authResponse) return authResponse;

  if (isPassthrough(pathname)) return NextResponse.next();

  // Static assets (images, fonts, etc.) live at the root of /public.
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  const country = countryFromHost(req.headers.get("host"));

  // Already prefixed (direct hit on /ke/... or /ug/...) - leave it alone.
  const first = pathname.split("/")[1];
  if (COUNTRY_CODES.includes(first)) return NextResponse.next();

  const target = VANITY[pathname] || pathname;
  const url = req.nextUrl.clone();
  url.pathname = `/${country}${target === "/" ? "" : target}`;

  const res = NextResponse.rewrite(url);
  // Shared caches must not serve one market's HTML on the other's domain.
  res.headers.set("x-fg-market", country);
  res.headers.append("Vary", "Host");
  return res;
}

export const config = {
  matcher: [
    // Everything except Next internals and files with an extension.
    "/((?!_next/static|_next/image).*)",
  ],
};
