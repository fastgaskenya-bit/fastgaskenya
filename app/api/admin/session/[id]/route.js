import { NextResponse } from "next/server";
import { getDb } from "../../../../../lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/session/[id] — return the full event stream for one session,
// plus a compact "profile" object derived from the most recent pageview.
export async function GET(_req, { params }) {
  try {
    const { id } = await params;
    if (!id) return NextResponse.json({ ok: false, reason: "bad_id" }, { status: 400 });

    const db = getDb();
    const snap = await db
      .collection("analytics_events")
      .where("sessionId", "==", id)
      .orderBy("createdAt", "asc")
      .limit(2000)
      .get();

    const events = [];
    snap.forEach((d) => events.push({ id: d.id, ...d.data() }));

    if (!events.length) {
      return NextResponse.json({ ok: false, reason: "not_found" }, { status: 404 });
    }

    const first = events[0];
    const last = events[events.length - 1];
    const profile = {
      sessionId: id,
      firstSeen: first.clientTs || null,
      lastSeen: last.clientTs || null,
      ip: last.ip || null,
      ipHash: last.ipHash || null,
      country: last.country || null,
      region: last.region || null,
      city: last.city || null,
      geo: last.geo || null,
      network: last.network || null,
      device: last.device || null,
      deviceModel: last.deviceModel || null,
      deviceVendor: last.deviceVendor || null,
      browser: last.browser || null,
      browserVersion: last.browserVersion || null,
      os: last.os || null,
      osVersion: last.osVersion || null,
      language: last.language || null,
      timezone: last.timezone || null,
      screen: last.screen || null,
      viewport: last.viewport || null,
      connection: last.connection || null,
      landing: first.landing || null,
      ua: last.ua || null,
    };

    const pageviews = events.filter((e) => e.type === "pageview").length;
    const clicks = events.filter((e) => e.type === "click").length;
    const durationMs =
      profile.firstSeen && profile.lastSeen ? profile.lastSeen - profile.firstSeen : 0;

    return NextResponse.json({
      profile,
      totals: { events: events.length, pageviews, clicks, durationMs },
      events: events.map((e) => ({
        id: e.id,
        type: e.type,
        path: e.path,
        clientTs: e.clientTs,
        target: e.target || null,
        x: e.x ?? null,
        y: e.y ?? null,
        referrer: e.referrer || null,
      })),
    });
  } catch (err) {
    console.error("session query error", err);
    return NextResponse.json(
      { ok: false, reason: "server_error", message: String(err.message || err) },
      { status: 500 }
    );
  }
}
