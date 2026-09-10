"use client";

import { Globe } from "lucide-react";
import { COUNTRIES, getCountry } from "../../lib/countries";

// Footer switcher. Renders real cross-domain anchors so crawlers can follow
// them between markets, which reinforces the hreflang pairing.
export default function CountrySwitcher({ country: countryCode, path = "/" }) {
  const current = getCountry(countryCode);
  const others = Object.values(COUNTRIES).filter((c) => c.code !== current.code);
  const suffix = path === "/" ? "" : path;

  if (others.length === 0) return null;

  return (
    <span className="country-switcher">
      <Globe size={14} aria-hidden="true" />
      <span className="country-switcher-label">Shop in:</span>
      <strong>{current.name}</strong>
      {others.map((other) => (
        <a
          key={other.code}
          href={`${other.siteUrl}${suffix}`}
          hrefLang={other.htmlLang}
          title={`${other.brandName} - prices in ${other.currency}`}
        >
          {other.name}
        </a>
      ))}
    </span>
  );
}
