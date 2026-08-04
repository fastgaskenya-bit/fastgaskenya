import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Nulls out the raw `ip` field on events older than IP_RETENTION_DAYS (default 30).
// Runs in batches of 400 (Firestore batch limit is 500) so a single invocation
// clears a reasonable chunk. Call daily via Vercel Cron or your scheduler.
//
// Auth: accepts either the admin cookie (from /api/admin/login) OR a matching
// CRON_SECRET header (so Vercel Cron / any scheduler can hit it).
export async function GET(req) {
  const days = parseInt(process.env.IP_RETENTION_DAYS || "30", 10);
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const cookieToken = req.cookies.get("fg_admin")?.value || "";
  const cronSecret = process.env.CRON_SECRET || "";
  const hdrSecret =
    req.headers.get("x-cron-secret") ||
    (req.headers.get("authorization") || "").replace(/^Bearer\s+/i, "");

  const cookieOk = adminPassword && cookieToken === adminPassword;
  const cronOk = cronSecret && hdrSecret === cronSecret;
  if (!cookieOk && !cronOk) {
    return NextResponse.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  try {
    const db = getDb();
    const snap = await db
      .collection("analytics_events")
      .where("createdAt", "<", cutoff)
      .orderBy("createdAt", "asc")
      .limit(400)
      .get();

    if (snap.empty) {
      return NextResponse.json({ ok: true, purged: 0, cutoff: cutoff.toISOString() });
    }

    const batch = db.batch();
    let purged = 0;
    snap.forEach((d) => {
      const data = d.data();
      if (data.ip != null) {
        batch.update(d.ref, { ip: null });
        purged++;
      }
    });
    if (purged > 0) await batch.commit();

    return NextResponse.json({
      ok: true,
      scanned: snap.size,
      purged,
      cutoff: cutoff.toISOString(),
      note:
        snap.size === 400
          ? "Hit batch limit — run again to purge more, or schedule daily."
          : undefined,
    });
  } catch (err) {
    console.error("cleanup error", err);
    return NextResponse.json(
      { ok: false, reason: "server_error", message: String(err.message || err) },
      { status: 500 }
    );
  }
}
