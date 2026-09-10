import { headers } from "next/headers";
import { products } from "../lib/catalog";
import { COUNTRIES, countryFromHost, getCountry } from "../lib/countries";

// One sitemap per domain, listing only that market's URLs, with hreflang
// alternates so Google pairs the Kenya and Uganda versions of each page.
export const dynamic = "force-dynamic";

function alternatesFor(path) {
  return Object.fromEntries(
    Object.values(COUNTRIES).map((c) => [
      c.htmlLang,
      `${c.siteUrl}${path === "/" ? "" : path}`,
    ]),
  );
}

export default async function sitemap() {
  const headerList = await headers();
  const country = getCountry(countryFromHost(headerList.get("host")));
  const now = new Date();

  const paths = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    ...products.map((product) => ({
      path: `/products/${product.slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
    { path: "/privacy", changeFrequency: "yearly", priority: 0.2 },
  ];

  return paths.map(({ path, changeFrequency, priority }) => ({
    url: `${country.siteUrl}${path === "/" ? "" : path}`,
    lastModified: now,
    changeFrequency,
    priority,
    alternates: { languages: alternatesFor(path) },
  }));
}
