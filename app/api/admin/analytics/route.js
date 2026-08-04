import { NextResponse } from "next/server";
import { getDb } from "../../../../lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/admin/analytics?hours=24&path=/optional
// Returns aggregates + raw click points for the given window/path.
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const hours = clampInt(url.searchParams.get("hours"), 1, 24 * 30, 24);
    const pathFilter = url.searchParams.get("path");

    const since = new Date(Date.now() - hours * 60 * 60 * 1000);
    const db = getDb();

    let q = db.collection("analytics_events").where("createdAt", ">=", since);
    if (pathFilter) q = q.where("path", "==", pathFilter);
    // Cap for safety; if you outgrow this, add pagination.
    const snap = await q.orderBy("createdAt", "desc").limit(20000).get();

    const events = [];
    snap.forEach((d) => events.push(d.data()));

    // Aggregations
    const byPath = new Map();
    const byDevice = new Map();
    const byBrowser = new Map();
    const byOs = new Map();
    const byCountry = new Map();
    const byHour = new Map(); // 'YYYY-MM-DDTHH' -> count
    const sessions = new Set();
    const ipHashes = new Set();
    const clickPoints = []; // [{ path, x, y, pageW, pageH, target }]
    const targetCounts = new Map(); // "tag#id.cls|text" -> count
    const rageBySession = new Map(); // sessionId -> [{path,x,y,ts}]
    const sessionMeta = new Map(); // sessionId -> latest event snapshot

    let pageviews = 0;
    let clicks = 0;

    for (const e of events) {
      if (e.sessionId) {
        sessions.add(e.sessionId);
        // events are ordered desc, so first hit wins = most recent snapshot.
        if (!sessionMeta.has(e.sessionId)) {
          sessionMeta.set(e.sessionId, {
            sessionId: e.sessionId,
            lastSeen: e.clientTs || 0,
            country: e.country || null,
            city: e.city || null,
            device: e.device || null,
            browser: e.browser || null,
            os: e.os || null,
            ip: e.ip || null,
            org: e.network?.org || null,
            asn: e.network?.asn || null,
            isVpnLikely: !!e.network?.isVpnLikely,
            entryPath: e.path,
            entryReferrer: e.landing?.referrer || e.referrer || null,
          });
        } else {
          // keep entryPath / referrer from earliest event
          const m = sessionMeta.get(e.sessionId);
          if ((e.clientTs || 0) < (m._earliestTs ?? Infinity) || e.type === "pageview") {
            m.entryPath = e.path;
            m.entryReferrer = e.landing?.referrer || e.referrer || m.entryReferrer;
            m._earliestTs = e.clientTs || m._earliestTs;
          }
        }
      }
      if (e.ipHash) ipHashes.add(e.ipHash);

      if (e.type === "pageview") {
        pageviews++;
        bump(byPath, e.path);
      }
      if (e.type === "click") {
        clicks++;
        if (typeof e.x === "number" && typeof e.y === "number") {
          clickPoints.push({
            path: e.path,
            x: e.x,
            y: e.y,
            pageW: e.pageW,
            pageH: e.pageH,
            target: e.target,
          });
        }
        if (e.target) {
          const key = `${e.target.tag || ""}${e.target.id ? "#" + e.target.id : ""} — ${
            e.target.text || ""
          }`;
          bump(targetCounts, key);
        }
        if (e.sessionId) {
          const arr = rageBySession.get(e.sessionId) || [];
          arr.push({ path: e.path, x: e.x, y: e.y, ts: e.clientTs || 0 });
          rageBySession.set(e.sessionId, arr);
        }
      }
      bump(byDevice, e.device || "unknown");
      bump(byBrowser, e.browser || "unknown");
      bump(byOs, e.os || "unknown");
      bump(byCountry, e.country || "unknown");

      const t = e.clientTs ? new Date(e.clientTs) : null;
      if (t && !Number.isNaN(t.getTime())) {
        const key = `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(
          t.getUTCDate()
        )}T${pad(t.getUTCHours())}`;
        byHour.set(key, (byHour.get(key) || 0) + 1);
      }
    }

    // Rage-click detection: 3+ clicks within 1s in the same ~40px area on the same path.
    const rageFlags = [];
    for (const [sid, arr] of rageBySession) {
      arr.sort((a, b) => a.ts - b.ts);
      for (let i = 0; i < arr.length - 2; i++) {
        const a = arr[i];
        const b = arr[i + 1];
        const c = arr[i + 2];
        if (
          a.path === b.path &&
          b.path === c.path &&
          c.ts - a.ts <= 1000 &&
          near(a, b, 40) &&
          near(b, c, 40)
        ) {
          rageFlags.push({ sessionId: sid, path: a.path, at: a.ts });
          break; // one flag per session is enough
        }
      }
    }

    return NextResponse.json({
      window: { hours, since: since.toISOString() },
      totals: {
        events: events.length,
        pageviews,
        clicks,
        sessions: sessions.size,
        uniqueVisitors: ipHashes.size,
      },
      topPages: sortTop(byPath, 20),
      devices: sortTop(byDevice),
      browsers: sortTop(byBrowser, 10),
      os: sortTop(byOs, 10),
      countries: sortTop(byCountry, 20),
      hourly: [...byHour.entries()]
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
        .map(([k, v]) => ({ hour: k, count: v })),
      topClickTargets: sortTop(targetCounts, 20),
      rageFlags,
      clickPoints: pathFilter ? clickPoints.slice(0, 5000) : [],
      recentSessions: [...sessionMeta.values()]
        .sort((a, b) => (b.lastSeen || 0) - (a.lastSeen || 0))
        .slice(0, 100)
        .map((s) => {
          const { _earliestTs, ...rest } = s;
          return rest;
        }),
    });
  } catch (err) {
    console.error("analytics query error", err);
    return NextResponse.json(
      { ok: false, reason: "server_error", message: String(err.message || err) },
      { status: 500 }
    );
  }
}

function bump(map, key) {
  map.set(key, (map.get(key) || 0) + 1);
}
function sortTop(map, n = 50) {
  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([key, count]) => ({ key, count }));
}
function pad(n) {
  return String(n).padStart(2, "0");
}
function clampInt(v, min, max, fallback) {
  const n = parseInt(v, 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(min, Math.min(max, n));
}
function near(a, b, d) {
  return Math.abs((a.x || 0) - (b.x || 0)) <= d && Math.abs((a.y || 0) - (b.y || 0)) <= d;
}
