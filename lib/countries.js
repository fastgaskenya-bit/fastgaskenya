// Country configuration for the FastGas multi-market site.
//
// Each domain maps to exactly one country. Middleware resolves the incoming
// Host header to a country code and rewrites the request under /<code>/...,
// so both markets stay statically generated with clean, prefix-free URLs.

export const DEFAULT_COUNTRY = "ke";

export const COUNTRIES = {
  ke: {
    code: "ke",
    iso: "KE",
    name: "Kenya",
    demonym: "Kenyan",
    possessive: "Kenya's",
    brandName: "FastGas Kenya",
    brandSuffix: "Kenya",
    domain: "fastgaskenya.shop",
    siteUrl: "https://fastgaskenya.shop",
    currency: "KES",
    currencySymbol: "KSh",
    ogLocale: "en_KE",
    intlLocale: "en-KE",
    htmlLang: "en-KE",
    capital: "Nairobi",
    cities: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret"],
    dispatchLine: "Nairobi dispatch",
    ordersLine: "Kenya orders",
    whatsapp: "254704129897",
    phoneDisplay: "+254 704 129 897",
    email: "fastgaskenya@gmail.com",
    instagramHandle: "@fastgas.ke",
    instagramUrl: "https://instagram.com/fastgas.ke",
    faqs: [
      {
        q: "How much does a FastGas 670g cream charger cost in Kenya?",
        a: "A single FastGas Original 670g N2O cylinder is {singlePrice}. A sealed case of six is {casePrice}, which works out to {perCanPrice} per can. The Exotic Whip cylinder is {exoticPrice} and the All in One Bundle is {bundlePrice}.",
      },
      {
        q: "Do you deliver cream chargers outside Nairobi?",
        a: "Yes. We dispatch from Nairobi and deliver countrywide, including Mombasa, Kisumu, Nakuru, and Eldoret. Delivery timing and cost are confirmed on WhatsApp when we review your order.",
      },
      {
        q: "Who can buy N2O cream chargers in Kenya?",
        a: "We supply food-service and culinary buyers: bars, restaurants, cafes, hotels, bakeries, catering companies, and event kitchens. Nitrous oxide is sold for E942 culinary use only and must never be inhaled.",
      },
      {
        q: "How do I check that my FastGas cylinder is genuine?",
        a: "Scan the QR code on the bottle, check the laser engraving, confirm the unique barcode digits, and verify the fill capacity. FastGas publishes these checks because copycat cylinders are common.",
      },
      {
        q: "How do I place an order?",
        a: "Build your order on this page, then send it to us on WhatsApp. We confirm stock, delivery to your location in Kenya, and payment instructions before dispatch.",
      },
    ],
    dataProtectionLaw: "Kenya's Data Protection Act, 2019",
    legalAdjective: "Kenyan",
    seo: {
      title: "FastGas Kenya | Buy N2O Cream Chargers in Nairobi",
      description:
        "Buy genuine FastGas Original 670g food-grade N2O cream charger cylinders in Kenya. Single cans or sealed cases of 6 for bars, cafes, restaurants, and caterers. Order on WhatsApp for fast Nairobi dispatch.",
      ogDescription:
        "FastGas Original 670g cream charger cylinders, single cans and cases of six, for Kenya's bars, cafes, and caterers.",
      twitterDescription:
        "Genuine FastGas Original 670g N2O cream charger cylinders. Order on WhatsApp for fast Nairobi dispatch.",
      keywords: [
        "FastGas Kenya",
        "N2O cream chargers Kenya",
        "cream chargers Nairobi",
        "buy N2O cylinder Kenya",
        "whipped cream chargers Kenya",
        "nitrous oxide cream charger Nairobi",
        "cream charger supplier Kenya",
        "FastGas 670g Kenya",
        "cocktail espuma chargers Nairobi",
        "Exotic Whip Kenya",
      ],
      productKeywords: [
        "FastGas Kenya",
        "N2O cream charger Kenya",
        "buy cream charger Nairobi",
        "cream charger delivery Kenya",
      ],
    },
  },
  ug: {
    code: "ug",
    iso: "UG",
    name: "Uganda",
    demonym: "Ugandan",
    possessive: "Uganda's",
    brandName: "FastGas Uganda",
    brandSuffix: "Uganda",
    domain: "fastgasuganda.shop",
    siteUrl: "https://fastgasuganda.shop",
    currency: "UGX",
    currencySymbol: "UGX",
    ogLocale: "en_UG",
    intlLocale: "en-UG",
    htmlLang: "en-UG",
    capital: "Kampala",
    cities: ["Kampala", "Entebbe", "Jinja", "Mbarara", "Gulu"],
    dispatchLine: "Kampala dispatch",
    ordersLine: "Uganda orders",
    whatsapp: "256741636790",
    phoneDisplay: "+256 741 636 790",
    email: "fastgaskenya@gmail.com",
    instagramHandle: "@fastgas.ke",
    instagramUrl: "https://instagram.com/fastgas.ke",
    faqs: [
      {
        q: "How much does a FastGas 670g cream charger cost in Uganda?",
        a: "A single FastGas Original 670g N2O cylinder is {singlePrice}. A sealed case of six is {casePrice}, which works out to {perCanPrice} per can. The Exotic Whip cylinder is {exoticPrice} and the All in One Bundle is {bundlePrice}.",
      },
      {
        q: "Do you deliver cream chargers outside Kampala?",
        a: "Yes. We dispatch from Kampala and deliver across Uganda, including Entebbe, Jinja, Mbarara, and Gulu. Delivery timing and cost are confirmed on WhatsApp when we review your order.",
      },
      {
        q: "Who can buy N2O cream chargers in Uganda?",
        a: "We supply food-service and culinary buyers: bars, restaurants, cafes, hotels, bakeries, catering companies, and event kitchens. Nitrous oxide is sold for E942 culinary use only and must never be inhaled.",
      },
      {
        q: "How do I check that my FastGas cylinder is genuine?",
        a: "Scan the QR code on the bottle, check the laser engraving, confirm the unique barcode digits, and verify the fill capacity. FastGas publishes these checks because copycat cylinders are common.",
      },
      {
        q: "How do I place an order?",
        a: "Build your order on this page, then send it to us on WhatsApp. We confirm stock, delivery to your location in Uganda, and payment instructions before dispatch.",
      },
    ],
    dataProtectionLaw: "Uganda's Data Protection and Privacy Act, 2019",
    legalAdjective: "Ugandan",
    seo: {
      title: "FastGas Uganda | Buy N2O Cream Chargers in Kampala",
      description:
        "Buy genuine FastGas Original 670g food-grade N2O cream charger cylinders in Uganda. Single cans or sealed cases of 6 for bars, cafes, restaurants, and caterers. Order on WhatsApp for fast Kampala dispatch.",
      ogDescription:
        "FastGas Original 670g cream charger cylinders, single cans and cases of six, for Uganda's bars, cafes, and caterers.",
      twitterDescription:
        "Genuine FastGas Original 670g N2O cream charger cylinders. Order on WhatsApp for fast Kampala dispatch.",
      keywords: [
        "FastGas Uganda",
        "N2O cream chargers Uganda",
        "cream chargers Kampala",
        "buy N2O cylinder Uganda",
        "whipped cream chargers Uganda",
        "nitrous oxide cream charger Kampala",
        "cream charger supplier Uganda",
        "FastGas 670g Uganda",
        "cocktail espuma chargers Kampala",
        "Exotic Whip Uganda",
      ],
      productKeywords: [
        "FastGas Uganda",
        "N2O cream charger Uganda",
        "buy cream charger Kampala",
        "cream charger delivery Uganda",
      ],
    },
  },
};

export const COUNTRY_CODES = Object.keys(COUNTRIES);

export function getCountry(code) {
  if (!code) return COUNTRIES[DEFAULT_COUNTRY];
  return COUNTRIES[String(code).toLowerCase()] || COUNTRIES[DEFAULT_COUNTRY];
}

export function isCountryCode(code) {
  return Boolean(code) && Object.hasOwn(COUNTRIES, String(code).toLowerCase());
}

// Resolves a Host header to a country code. Unknown hosts (localhost, Vercel
// preview URLs, bare IPs) fall back to the default market so nothing 404s.
export function countryFromHost(host) {
  if (!host) return DEFAULT_COUNTRY;
  const hostname = String(host).toLowerCase().split(":")[0];

  for (const country of Object.values(COUNTRIES)) {
    if (hostname === country.domain || hostname.endsWith(`.${country.domain}`)) {
      return country.code;
    }
  }

  // Dev + preview conveniences: ug.localhost, fastgasuganda-*.vercel.app, etc.
  if (/(^|[.-])ug(anda)?([.-]|$)/.test(hostname)) return "ug";
  if (/(^|[.-])ke(nya)?([.-]|$)/.test(hostname)) return "ke";

  return DEFAULT_COUNTRY;
}

// ISO-3166 alpha-2 from an edge geo header -> the market we serve it, or null.
export function countryFromIso(iso) {
  if (!iso) return null;
  const upper = String(iso).toUpperCase();
  const match = Object.values(COUNTRIES).find((c) => c.iso === upper);
  return match ? match.code : null;
}

export function alternateLanguages(path = "/") {
  const suffix = path === "/" ? "" : path;
  return Object.fromEntries(
    Object.values(COUNTRIES).map((c) => [c.htmlLang, `${c.siteUrl}${suffix}`]),
  );
}
