export const products = [
  {
    id: "single-can",
    contentId: "hpiu5i5mr7",
    slug: "fastgas-original-670g",
    eyebrow: "Single cylinder",
    name: "FastGas Original 670g N2O Can",
    shortName: "FastGas Original 670g",
    price: 4800,
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
    price: 28000,
    unit: "6 cans",
    image:
      "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_-box-600x600.png",
    alt: "FastGas Original 670g case box",
    description:
      "A sealed case for restaurants, lounges, cafes, caterers, and wholesale buyers who need steady stock.",
    detailDescription:
      "A sealed FastGas Original 670g case for food-service teams that need predictable stock for busy bar programs, dessert stations, catering prep, and high-volume cafe service.",
    headline: "A 6-can FastGas case for busy bars, cafes, and caterers.",
    details: ["KSh 4,667 per can", "12.6kg case weight", "Fast restock format"],
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
    price: 5000,
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

export function money(value) {
  return `KSh ${new Intl.NumberFormat("en-KE", {
    maximumFractionDigits: 0,
  }).format(value)}`;
}

export function getProductBySlug(slug) {
  return products.find((product) => product.slug === slug);
}

export function getOrderMailto(items, fallbackProduct = products[0]) {
  const lineItems = items?.length
    ? items
    : [{ ...fallbackProduct, quantity: 1, total: fallbackProduct.price }];
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  const orderLines = lineItems
    .map((item) => `${item.quantity} x ${item.name} (${item.unit}) - ${money(item.total)}`)
    .join("%0D%0A");

  return `mailto:fastgaskenya@gmail.com?subject=FastGas Kenya order request&body=Hi FastGas Kenya,%0D%0A%0D%0AI'd like to order:%0D%0A${orderLines}%0D%0A%0D%0ATotal: ${money(total)}%0D%0A%0D%0AUse case: Culinary / food-service%0D%0ADelivery location:%0D%0AName:%0D%0APhone:`;
}

export const whatsappNumber = "254704129897";

export function getOrderWhatsapp(items, fallbackProduct = products[0]) {
  const lineItems = items?.length
    ? items
    : [{ ...fallbackProduct, quantity: 1, total: fallbackProduct.price }];
  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  const orderLines = lineItems
    .map((item) => `${item.quantity} x ${item.name} (${item.unit}) - ${money(item.total)}`)
    .join("\n");

  const message = `Hi FastGas Kenya, I'd like to order:\n${orderLines}\n\nTotal: ${money(total)}\n\nUse case: Culinary / food-service\nDelivery location:\nName:`;

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}
