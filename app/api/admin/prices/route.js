import { NextResponse } from "next/server";
import { products } from "../../../../lib/catalog";
import { getDb } from "../../../../lib/firebase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MARKETS = ["ke", "ug"];
const MAX_PRICE = 100000000;

function defaultPrices() {
  return Object.fromEntries(
    products.map((product) => [product.id, { ...product.prices }]),
  );
}

function validatePrices(value) {
  if (!value || typeof value !== "object") {
    return { error: "Missing price data." };
  }

  const prices = {};
  for (const product of products) {
    const submitted = value[product.id];
    if (!submitted || typeof submitted !== "object") {
      return { error: `Missing prices for ${product.name}.` };
    }

    prices[product.id] = {};
    for (const market of MARKETS) {
      const amount = Number(submitted[market]);
      if (!Number.isSafeInteger(amount) || amount < 1 || amount > MAX_PRICE) {
        return {
          error: `Enter a whole number between 1 and ${MAX_PRICE.toLocaleString()} for ${product.name} (${market.toUpperCase()}).`,
        };
      }
      prices[product.id][market] = amount;
    }
  }

  return { prices };
}

export async function GET() {
  try {
    const snapshot = await getDb()
      .collection("site_settings")
      .doc("product_prices")
      .get();
    const savedPrices = snapshot.exists ? snapshot.data()?.prices : {};
    const defaults = defaultPrices();

    return NextResponse.json({
      prices: Object.fromEntries(
        products.map((product) => [
          product.id,
          { ...defaults[product.id], ...(savedPrices?.[product.id] || {}) },
        ]),
      ),
      products: products.map(({ id, name, unit }) => ({ id, name, unit })),
    });
  } catch (error) {
    console.error("Could not load prices:", error);
    return NextResponse.json(
      { ok: false, message: "Could not load prices." },
      { status: 500 },
    );
  }
}

export async function PATCH(request) {
  const body = await request.json().catch(() => null);
  const result = validatePrices(body?.prices);
  if (result.error) {
    return NextResponse.json({ ok: false, message: result.error }, { status: 400 });
  }

  try {
    await getDb().collection("site_settings").doc("product_prices").set(
      {
        prices: result.prices,
        updatedAt: new Date(),
      },
      { merge: true },
    );
    return NextResponse.json({ ok: true, prices: result.prices });
  } catch (error) {
    console.error("Could not save prices:", error);
    return NextResponse.json(
      { ok: false, message: "Could not save prices." },
      { status: 500 },
    );
  }
}
