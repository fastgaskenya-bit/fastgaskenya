import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { getDb } from "../../../lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- rate limit (per-IP, in-memory) ---
const bucket = new Map();
const WINDOW_MS = 10_000;
const MAX_EVENTS = 60;
function ratelimit(ip) {
  const now = Date.now();
  const arr = (bucket.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  arr.push(now);
  bucket.set(ip, arr);
  return arr.length <= MAX_EVENTS;
}

// --- ipinfo lookup cache ---
// Same IP within 6 hours = cached. Keeps free tier alive.
const IP_CACHE_TTL = 6 * 60 * 60 * 1000;
const ipCache = new Map();
async function ipinfoLookup(ip) {
  const token = process.env.IPINFO_TOKEN;
  if (!token || !ip || ip === "unknown" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.")) {
    return null;
  }
  const cached = ipCache.get(ip);
  if (cached && Date.now() - cached.at < IP_CACHE_TTL) return cached.data;
  try {
    // Uses the free IPinfo Lite endpoint: unlimited requests, returns
    // country + ASN + AS name + AS domain. City/lat come from platform
    // geo headers (Netlify x-nf-geo) elsewhere.
    const r = await fetch(
      `https://api.ipinfo.io/lite/${encodeURIComponent(ip)}?token=${token}`,
      { signal: AbortSignal.timeout(1500) }
    );
    if (!r.ok) return null;
    const j = await r.json();
    const org = j.as_name || "";
    const data = {
      city: null,
      region: null,
      country: j.country_code || null,
      countryName: j.country || null,
      continent: j.continent || null,
      postal: null,
      lat: null,
      lon: null,
      timezone: null,
      hostname: null,
      asn: j.asn || null,
      org,
      asDomain: j.as_domain || null,
      isVpnLikely:
        /vpn|proxy|hosting|datacenter|amazon|google|microsoft|azure|linode|digitalocean|hetzner|ovh|oracle|cloudflare|akamai|fastly/i.test(
          org
        ),
    };
    ipCache.set(ip, { at: Date.now(), data });
    return data;
  } catch {
    return null;
  }
}

function parseNetlifyGeo(header) {
  if (!header) return null;
  try {
    const decoded = Buffer.from(header, "base64").toString("utf8");
    const j = JSON.parse(decoded);
    return j && typeof j === "object" ? j : null;
  } catch {
    return null;
  }
}

function getIp(req) {
  const xff = req.headers.get("x-forwarded-for") || "";
  return xff.split(",")[0].trim() || req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req) {
  try {
    const ip = getIp(req);
    if (!ratelimit(ip)) {
      return NextResponse.json({ ok: false, reason: "rate_limited" }, { status: 429 });
    }

    const body = await req.json().catch(() => ({}));
    const {
      type,
      path,
      sessionId,
      referrer,
      viewport,
      screen: screenInfo,
      language,
      languages,
      timezone,
      connection,
      landing,
      x,
      y,
      target,
      pageW,
      pageH,
      ts,
    } = body || {};

    if (!type || !path || !sessionId) {
      return NextResponse.json({ ok: false, reason: "bad_body" }, { status: 400 });
    }
    if (!["pageview", "click"].includes(type)) {
      return NextResponse.json({ ok: false, reason: "bad_type" }, { status: 400 });
    }

    const ua = req.headers.get("user-agent") || "";
    const parsed = UAParser(ua);

    // Geo from platform headers. Vercel: x-vercel-ip-*. Cloudflare: cf-*.
    // Netlify: x-nf-geo, a base64-encoded JSON blob.
    const nfGeo = parseNetlifyGeo(req.headers.get("x-nf-geo"));
    const country =
      req.headers.get("x-vercel-ip-country") ||
      req.headers.get("cf-ipcountry") ||
      nfGeo?.country?.code ||
      null;
    const city =
      req.headers.get("x-vercel-ip-city") ||
      req.headers.get("cf-ipcity") ||
      nfGeo?.city ||
      null;
    const region =
      req.headers.get("x-vercel-ip-country-region") ||
      req.headers.get("cf-region") ||
      nfGeo?.subdivision?.code ||
      null;

    const ipHash = await sha256(ip + (process.env.IP_SALT || "fastgas"));

    // Enrichment via ipinfo (non-blocking failure)
    const ipData = await ipinfoLookup(ip).catch(() => null);

    const doc = {
      type,
      path: String(path).slice(0, 300),
      sessionId: String(sessionId).slice(0, 64),
      referrer: referrer ? String(referrer).slice(0, 300) : null,
      viewport: sanitizeObj(viewport, ["w", "h"]),
      screen: sanitizeObj(screenInfo, ["w", "h", "dpr", "colorDepth"]),
      language: str(language, 24),
      languages: Array.isArray(languages) ? languages.slice(0, 5).map((l) => str(l, 24)) : null,
      timezone: str(timezone, 64),
      connection: sanitizeObj(connection, ["type", "downlink", "rtt", "saveData"]),
      landing: landing
        ? {
            url: str(landing.url, 500),
            referrer: str(landing.referrer, 300),
            utm: landing.utm && typeof landing.utm === "object" ? landing.utm : null,
            landedAt: Number.isFinite(landing.landedAt) ? landing.landedAt : null,
          }
        : null,
      ua: str(ua, 400),
      device: parsed.device.type || "desktop",
      deviceModel: str(parsed.device.model, 64),
      deviceVendor: str(parsed.device.vendor, 64),
      browser: parsed.browser.name || "unknown",
      browserVersion: str(parsed.browser.version, 32),
      os: parsed.os.name || "unknown",
      osVersion: str(parsed.os.version, 32),
      // geo from platform headers (fast, no API call)
      country: country || (ipData && ipData.country) || null,
      city: city || (ipData && ipData.city) || null,
      region: region || (ipData && ipData.region) || null,
      // ipinfo enrichment
      geo: ipData
        ? {
            lat: ipData.lat,
            lon: ipData.lon,
            postal: ipData.postal,
            timezone: ipData.timezone,
          }
        : null,
      network: ipData
        ? {
            hostname: ipData.hostname,
            asn: ipData.asn,
            org: ipData.org,
            isVpnLikely: ipData.isVpnLikely,
          }
        : null,
      ipHash,
      ip, // raw IP — purged after 30 days by /api/admin/cleanup
      createdAt: FieldValue.serverTimestamp(),
      clientTs: typeof ts === "number" ? ts : Date.now(),
    };

    if (type === "click") {
      doc.x = clampNum(x);
      doc.y = clampNum(y);
      doc.pageW = clampNum(pageW);
      doc.pageH = clampNum(pageH);
      doc.target = target
        ? {
            tag: str(target.tag, 24),
            id: str(target.id, 100),
            cls: str(target.cls, 200),
            text: str(target.text, 120),
            href: str(target.href, 300),
          }
        : null;
    }

    const db = getDb();
    await db.collection("analytics_events").add(doc);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("track error", err);
    return NextResponse.json({ ok: false, reason: "server_error" }, { status: 500 });
  }
}

function str(v, n) {
  return v == null ? null : String(v).slice(0, n);
}
function sanitizeObj(o, keys) {
  if (!o || typeof o !== "object") return null;
  const out = {};
  for (const k of keys) if (k in o) out[k] = typeof o[k] === "string" ? str(o[k], 64) : o[k] ?? null;
  return out;
}
function clampNum(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return null;
  return Math.max(-100000, Math.min(100000, Math.round(x)));
}
async function sha256(s) {
  const buf = new TextEncoder().encode(s);
  const hash = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
