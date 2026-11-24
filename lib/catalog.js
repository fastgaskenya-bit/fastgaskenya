import { DEFAULT_COUNTRY, getCountry } from "./countries";

// Prices are held per market, set from the price list of 11 Sep 2026.
// UGX sits at roughly 28-30x the KES figure, rounded to clean retail numbers;
// the two are independent, so edit whichever market you are repricing.
// Changing a number here updates the shop, product pages, order messages,
// the FAQ copy and the Product schema together.
export const products = [
  {
    id: "single-can",
    contentId: "hpiu5i5mr7",
    slug: "fastgas-original-670g",
    eyebrow: "Single cylinder",
    name: "FastGas Original 670g N2O Can",
    shortName: "FastGas Original 670g",
    prices: { ke: 5000, ug: 150000 },
    unit: "1 can",
    image:
      "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_front-view-e1764672680684.png",
    alt: "FastGas Original 670g N2O cylinder",
    description:
      "Food-service nitrous oxide cylinder for whipped cream, espumas, sauces, and cocktail programs.",
    detailDescription:
      "A single FastGas Original 670g food-grade N2O cylinder for bars, cafes, restaurants, bakers, and event kitchens that need consistent foam, cream, and espuma output without buying a full case.",
    headline: "FastGas Original 670g for cocktail foams, cream, and kitchen service.",
    details: ["670g capacity", "M10x1 valve", "QR authenticity check"],
    specs: [
      ["Capacity", "670 grams"],
      ["Gas", "Nitrous oxide"],
      ["Food use", "E942 culinary applications"],
      ["Casing", "Disposable carbon steel"],
      ["Valve", "M10x1"],
      ["Units", "1 cylinder"],
    ],
    useCases: [
      "Cocktail espumas",
      "Cream chargers for bars",
      "Whipped cream toppings",
      "Dessert service",
      "Cold foams",
      "Sauces and infusions",
    ],
    adAngles: [
      "Run cocktail-menu ads directly to this 670g can page.",
      "Use for single-unit buyers testing FastGas before scaling.",
      "Best for chefs, bartenders, cafes, lounges, and event teams.",
    ],
  },
  {
    id: "case-six",
    slug: "fastgas-case-of-6",
    eyebrow: "Best value",
    name: "FastGas Original Case of 6",
    shortName: "FastGas Case of 6",
    prices: { ke: 30000, ug: 850000 },
    unit: "6 cans",
    unitsPerPack: 6,
    image:
      "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_-box-600x600.png",
    alt: "FastGas Original 670g case box",
    description:
      "A sealed case for restaurants, lounges, cafes, caterers, and wholesale buyers who need steady stock.",
    detailDescription:
      "A sealed FastGas Original 670g case for food-service teams that need predictable stock for busy bar programs, dessert stations, catering prep, and high-volume cafe service.",
    headline: "A 6-can FastGas case for busy bars, cafes, and caterers.",
    details: ["{perUnit} per can", "12.6kg case weight", "Fast restock format"],
    specs: [
      ["Capacity", "6 x 670 grams"],
      ["Gas", "Nitrous oxide"],
      ["Food use", "E942 culinary applications"],
      ["Case weight", "12.6 kg"],
      ["Case size", "25.5 x 17.5 x 27 cm"],
      ["Units per case", "6"],
    ],
    useCases: [
      "Cocktail programs",
      "High-volume whipped cream",
      "Cafe cold foam menus",
      "Event catering",
      "Restaurant dessert stations",
      "Wholesale restock",
    ],
    adAngles: [
      "Run B2B ads for restaurants, lounges, caterers, and cafes.",
      "Lead with better per-can value for repeat buyers.",
      "Best for buyers who already know they need multiple cylinders.",
    ],
  },
  {
    id: "exotic-whip",
    slug: "exotic-whip",
    eyebrow: "Premium cream whip",
    name: "Exotic Whip N2O Cream Charger",
    shortName: "Exotic Whip",
    prices: { ke: 5000, ug: 145000 },
    unit: "1 cylinder",
    image: "/exotic-nobg.png",
    alt: "Exotic Whip N2O cream charger cylinder",
    description:
      "Premium food-grade N2O cream charger with an integrated dispensing nozzle for whipped cream, foams, and espumas.",
    detailDescription:
      "The Exotic Whip cream charger delivers food-grade nitrous oxide through a built-in dispensing nozzle, giving bars, cafes, and event kitchens fast, consistent cream and foam output without a separate dispenser.",
    headline: "Exotic Whip for effortless cream, foams, and cocktail espumas.",
    details: ["Integrated dispensing nozzle", "Food-grade N2O", "Single-cylinder format"],
    specs: [
      ["Gas", "Nitrous oxide"],
      ["Food use", "E942 culinary applications"],
      ["Casing", "Disposable steel"],
      ["Dispensing", "Integrated nozzle"],
      ["Units", "1 cylinder"],
    ],
    useCases: [
      "Whipped cream toppings",
      "Cocktail espumas",
      "Cold foams",
      "Dessert service",
      "Sauces and infusions",
      "Event catering",
    ],
    adAngles: [
      "Lead with the built-in nozzle for fast, no-fuss dispensing.",
      "Great for bars and cafes that want cream and foam without extra tools.",
      "Best for buyers wanting a premium ready-to-use whip format.",
    ],
  },
  {
    id: "all-in-one",
    slug: "all-in-one-bundle",
    eyebrow: "Mixed bundle",
    name: "All in One Bundle",
    shortName: "All in One Bundle",
    prices: { ke: 29000, ug: 850000 },
    unit: "3 Exotic Whip + 3 single cans",
    image: "/all-in-one-bundle-v2.png",
    alt: "All in One Bundle with 3 Exotic Whip chargers and 3 FastGas 670g cylinders",
    description:
      "A mixed bundle of 3 Exotic Whip chargers and 3 FastGas Original 670g cans for kitchens that want both formats at one value price.",
    detailDescription:
      "The All in One Bundle pairs 3 Exotic Whip cream chargers with 3 FastGas Original 670g cylinders, giving bars, cafes, and event kitchens both formats on hand for whipped cream, foams, espumas, and cocktail programs at a single bundle price.",
    headline: "3 Exotic Whip and 3 FastGas 670g cans in one value bundle.",
    details: ["3 x Exotic Whip", "3 x FastGas 670g", "Best-value mixed pack"],
    specs: [
      ["Contents", "3 Exotic Whip + 3 FastGas 670g"],
      ["Gas", "Nitrous oxide"],
      ["Food use", "E942 culinary applications"],
      ["Casing", "Disposable steel"],
      ["Units", "6 cylinders"],
    ],
    useCases: [
      "Whipped cream toppings",
      "Cocktail espumas",
      "Cold foams",
      "Dessert service",
      "Sauces and infusions",
      "Event catering",
    ],
    adAngles: [
      "Lead with the mix of both formats at one bundle price.",
      "Great for kitchens that want to try Exotic Whip alongside the 670g cans.",
      "Best for buyers who want variety and value in a single order.",
    ],
  },
];

export const sourceNotes = [
  "Official FastGas lists the 670g Original Cream Charger as European-quality nitrous oxide in a safe, disposable steel canister.",
  "FastGas highlights QR verification, laser engravings, unique barcodes, and capacity checks to help customers avoid fake products.",
  "The brand positions the product for whipped cream, foams, espumas, cocktails, sauces, and food-service businesses.",
];

export const sharedSpecs = [
  ["Capacity", "670 grams"],
  ["Gas", "Nitrous oxide"],
  ["Food use", "E942 culinary applications"],
  ["Casing", "Disposable carbon steel"],
  ["Valve", "M10x1"],
  ["Units per case", "6"],
];

export function priceFor(product, countryCode = DEFAULT_COUNTRY) {
  const country = getCountry(countryCode);
  return product?.prices?.[country.code] ?? product?.prices?.[DEFAULT_COUNTRY] ?? 0;
}

export function money(value, countryCode = DEFAULT_COUNTRY) {
  const country = getCountry(countryCode);
  return `${country.currencySymbol} ${new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0))}`;
}

// Some catalog copy quotes a per-unit price; fill it in for the active market.
export function productDetails(product, countryCode = DEFAULT_COUNTRY) {
  const packs = product.unitsPerPack || 1;
  const perUnit = money(priceFor(product, countryCode) / packs, countryCode);
  return product.details.map((detail) => detail.replace("{perUnit}", perUnit));
}

export function getProductBySlug(slug, catalog = products) {
  return catalog.find((product) => product.slug === slug);
}

function buildLines(items, fallbackProduct, countryCode) {
  const lineItems = items?.length
    ? items
    : [
        {
          ...fallbackProduct,
          quantity: 1,
          total: priceFor(fallbackProduct, countryCode),
        },
      ];
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  return { lineItems, total };
}

export function getOrderMailto(
  items,
  countryCode = DEFAULT_COUNTRY,
  fallbackProduct = products[0],
) {
  const country = getCountry(countryCode);
  const { lineItems, total } = buildLines(items, fallbackProduct, country.code);
  const orderLines = lineItems
    .map(
      (item) =>
        `${item.quantity} x ${item.name} (${item.unit}) - ${money(item.total, country.code)}`,
    )
    .join("%0D%0A");

  return `mailto:${country.email}?subject=${encodeURIComponent(
    `${country.brandName} order request`,
  )}&body=Hi ${country.brandName},%0D%0A%0D%0AI'd like to order:%0D%0A${orderLines}%0D%0A%0D%0ATotal: ${money(
    total,
    country.code,
  )}%0D%0A%0D%0AUse case: Culinary / food-service%0D%0ADelivery location:%0D%0AName:%0D%0APhone:`;
}

export function getOrderWhatsapp(
  items,
  countryCode = DEFAULT_COUNTRY,
  fallbackProduct = products[0],
) {
  const country = getCountry(countryCode);
  const { lineItems, total } = buildLines(items, fallbackProduct, country.code);
  const orderLines = lineItems
    .map(
      (item) =>
        `${item.quantity} x ${item.name} (${item.unit}) - ${money(item.total, country.code)}`,
    )
    .join("\n");

  const message = `Hi ${country.brandName}, I'd like to order:\n${orderLines}\n\nTotal: ${money(
    total,
    country.code,
  )}\n\nCountry: ${country.name}\nUse case: Culinary / food-service\nDelivery location:\nName:`;

  return `https://wa.me/${country.whatsapp}?text=${encodeURIComponent(message)}`;
}

// FAQ copy quotes live prices; fill them from the catalog so the answers and
// the FAQPage schema can never drift from what the shop actually charges.
export function resolveFaqs(country, catalog = products) {
  const bySlug = (slug) => getProductBySlug(slug, catalog);
  const price = (slug) => money(priceFor(bySlug(slug), country.code), country.code);
  const six = bySlug("fastgas-case-of-6");

  const tokens = {
    "{singlePrice}": price("fastgas-original-670g"),
    "{casePrice}": price("fastgas-case-of-6"),
    "{perCanPrice}": money(priceFor(six, country.code) / 6, country.code),
    "{exoticPrice}": price("exotic-whip"),
    "{bundlePrice}": price("all-in-one-bundle"),
  };

  const fill = (text) =>
    Object.entries(tokens).reduce((out, [k, v]) => out.split(k).join(v), text);

  return (country.faqs || []).map((faq) => ({ q: fill(faq.q), a: fill(faq.a) }));
}
