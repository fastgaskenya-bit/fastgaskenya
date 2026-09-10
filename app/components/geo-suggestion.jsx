"use client";

import { useEffect, useState } from "react";
import { ArrowRight, X } from "lucide-react";
import { COUNTRIES, getCountry } from "../../lib/countries";

const DISMISS_KEY = "fg_geo_dismissed";

// Suggests the matching country site when a visitor's IP country does not
// match the domain they landed on. Deliberately a dismissible banner rather
// than a redirect: auto-redirecting by IP breaks crawling (Googlebot crawls
// from the US) and traps people who deliberately opened the other market.
export default function GeoSuggestion({ country: countryCode }) {
  const current = getCountry(countryCode);
  const [suggested, setSuggested] = useState(null);

  useEffect(() => {
    let cancelled = false;

    try {
      if (window.localStorage.getItem(DISMISS_KEY) === "1") return;
    } catch {
      // Storage blocked (private window, blocked cookies) - just show it.
    }

    fetch("/api/geo", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data?.market) return;
        if (data.market === current.code) return;
        if (!COUNTRIES[data.market]) return;
        setSuggested(COUNTRIES[data.market]);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [current.code]);

  if (!suggested) return null;

  const dismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_KEY, "1");
    } catch {
      // Ignore - dismissal just won't persist.
    }
    setSuggested(null);
  };

  return (
    <div className="geo-banner" role="region" aria-label="Country suggestion">
      <p>
        Looks like you&rsquo;re in {suggested.name}. See prices in{" "}
        {suggested.currency} on our {suggested.name} site.
      </p>
      <div className="geo-banner-actions">
        <a href={suggested.siteUrl} className="geo-banner-go">
          Go to {suggested.brandName}
          <ArrowRight size={16} aria-hidden="true" />
        </a>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Dismiss country suggestion"
          className="geo-banner-close"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
