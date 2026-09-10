import { headers } from "next/headers";
import { countryFromHost, getCountry } from "../lib/countries";

export const dynamic = "force-dynamic";

export default async function robots() {
  const headerList = await headers();
  const country = getCountry(countryFromHost(headerList.get("host")));

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/"],
    },
    sitemap: `${country.siteUrl}/sitemap.xml`,
    host: country.siteUrl,
  };
}
