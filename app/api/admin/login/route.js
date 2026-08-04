import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req) {
  const { password, next } = await req.json().catch(() => ({}));
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) {
    return NextResponse.json(
      { ok: false, reason: "server_not_configured" },
      { status: 500 }
    );
  }
  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, reason: "bad_password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, next: next || "/admin/analytics" });
  res.cookies.set("fg_admin", expected, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("fg_admin", "", { path: "/", maxAge: 0 });
  return res;
}
