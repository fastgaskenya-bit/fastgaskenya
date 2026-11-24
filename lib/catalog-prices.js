import { products } from "./catalog";
import { getDb } from "./firebase-admin";

// The catalog is the safe fallback. Once an admin saves a price, the matching
// values in Firestore override it without requiring a deploy.
export async function getCatalogProducts() {
  try {
    const snapshot = await getDb()
      .collection("site_settings")
      .doc("product_prices")
      .get();

    const savedPrices = snapshot.exists ? snapshot.data()?.prices : null;
    if (!savedPrices || typeof savedPrices !== "object") return products;

    return products.map((product) => ({
      ...product,
      prices: {
        ...product.prices,
        ...(savedPrices[product.id] || {}),
      },
    }));
  } catch (error) {
    // A Firebase outage must never stop customers from using the shop.
    console.error("Could not load saved product prices:", error);
    return products;
  }
}
