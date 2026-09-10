import { NextResponse } from "next/server";
import { countryFromIso } from "../../../lib/countries";

export const dynamic = "force-dynamic";

// Returns the market that matches the visitor's IP country, if we serve one.
// Kept as a tiny client-fetched endpoint so the marketing pages themselves
// stay statically generated and cacheable per domain.
export async function GET(req) {
  const iso =
    req.headers.get("x-vercel-ip-country") ||
    req.headers.get("cf-ipcountry") ||
    req.headers.get("x-country-code") ||
    null;

  return NextResponse.json(
    { iso: iso || null, market: countryFromIso(iso) },
    { headers: { "cache-control": "no-store" } },
  );
}
