import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  MessageCircle,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import {
  getOrderWhatsapp,
  getProductBySlug,
  money,
  priceFor,
  products,
  sourceNotes,
} from "../../../../lib/catalog";
import { getCatalogProducts } from "../../../../lib/catalog-prices";
import {
  COUNTRY_CODES,
  alternateLanguages,
  getCountry,
  isCountryCode,
} from "../../../../lib/countries";
import MetaTrackedLink from "../../../components/meta-tracked-link";
import CountrySwitcher from "../../../components/country-switcher";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return COUNTRY_CODES.flatMap((country) =>
    products.map((product) => ({ country, slug: product.slug })),
  );
}

export async function generateMetadata({ params }) {
  const { country: code, slug } = await params;
  const catalog = await getCatalogProducts();
  const product = getProductBySlug(slug, catalog);
  const country = getCountry(code);

  if (!product || !isCountryCode(code)) {
    return {
      title: `${country.brandName} Product`,
    };
  }

  const price = money(priceFor(product, country.code), country.code);
  const path = `/products/${product.slug}`;

  return {
    title: `${product.shortName} | Buy in ${country.name}`,
    description: `${product.name} for culinary cocktail foams, espumas, whipped cream, cafe, bar, and catering use in ${country.name}. ${price}. Order on WhatsApp for ${country.capital} dispatch.`,
    keywords: [
      product.shortName,
      `${product.shortName} ${country.name}`,
      `${product.shortName} price ${country.name}`,
      ...country.seo.productKeywords,
      ...product.useCases,
    ],
    alternates: {
      canonical: path,
      languages: alternateLanguages(path),
    },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: `${product.shortName} - ${price}`,
      description: product.detailDescription,
      url: `${country.siteUrl}${path}`,
      siteName: country.brandName,
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.alt,
        },
      ],
      locale: country.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.shortName} - ${price}`,
      description: product.detailDescription,
      images: [product.image],
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { country: code, slug } = await params;
  const catalog = await getCatalogProducts();
  const product = getProductBySlug(slug, catalog);

  if (!product || !isCountryCode(code)) {
    notFound();
  }

  const country = getCountry(code);
  const path = `/products/${product.slug}`;
  const price = priceFor(product, country.code);

  const whatsappHref = getOrderWhatsapp(
    [{ ...product, price, quantity: 1, total: price }],
    country.code,
    product,
  );
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.image,
    description: product.detailDescription,
    brand: {
      "@type": "Brand",
      name: "FastGas",
    },
    category: "Food-service cream charger",
    offers: {
      "@type": "Offer",
      priceCurrency: country.currency,
      price,
      availability: "https://schema.org/InStock",
      url: `${country.siteUrl}${path}`,
      areaServed: {
        "@type": "Country",
        name: country.name,
        identifier: country.iso,
      },
      seller: {
        "@type": "Organization",
        name: country.brandName,
        url: country.siteUrl,
      },
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: country.brandName,
        item: country.siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.shortName,
        item: `${country.siteUrl}${path}`,
      },
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <header className="site-header">
        <Link className="brand" href="/" aria-label={`${country.brandName} home`}>
          <span className="brand-mark">F&gt;G</span>
          <span>
            FastGas
            <small>{country.brandSuffix}</small>
          </span>
        </Link>
        <nav aria-label="Product navigation">
          <a href="#use-cases">Use cases</a>
          <a href="#specs">Specs</a>
          <a href="#order">Order</a>
        </nav>
        <Link className="cart-button" href="/#shop">
          <ChevronLeft size={18} />
          <span>Shop</span>
          <strong>2</strong>
        </Link>
      </header>

      <section className="product-detail-hero">
        <div className="product-detail-copy">
          <Link className="back-link" href="/#shop">
            <ChevronLeft size={16} />
            Back to shop
          </Link>
          <p className="kicker">
            <Sparkles size={16} />
            Culinary product page
          </p>
          <h1>{product.headline}</h1>
          <p className="hero-lede">{product.detailDescription}</p>

          <div className="price-strip" aria-label="Product price">
            <span>
              Price <strong>{money(price, country.code)}</strong>
            </span>
            <span>
              Unit <strong>{product.unit}</strong>
            </span>
          </div>

          <div className="hero-actions">
            <MetaTrackedLink
              className="primary-action"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              eventName="InitiateCheckout"
              eventPayload={{
                content_name: product.name,
                content_category: "product",
                content_ids: [product.contentId || product.id],
                content_type: "product",
                currency: country.currency,
                value: price,
              }}
            >
              <MessageCircle size={18} /> Order Now on WhatsApp
            </MetaTrackedLink>
            <a className="secondary-action" href="#use-cases">
              View culinary uses <ChevronRight size={18} />
            </a>
          </div>
        </div>

        <div className="detail-product-stage">
          <div className="product-halo" />
          <Image
            priority
            src={product.image}
            alt={product.alt}
            width={720}
            height={720}
            className="detail-product-image"
          />
          <div className="floating-note detail-note-one">
            <BadgeCheck size={18} />
            Original FastGas checks
          </div>
          <div className="floating-note detail-note-two">
            <CookingPot size={18} />
            Culinary use only
          </div>
        </div>
      </section>

      <section className="trust-band" aria-label="Product promises">
        <div>
          <Truck />
          {country.ordersLine}
        </div>
        <div>
          <ShieldCheck />
          Food-service buyers
        </div>
        <div>
          <ScanLine />
          QR verification
        </div>
        <div>
          <CookingPot />
          Not for inhalation
        </div>
      </section>

      <section id="use-cases" className="section use-case-section">
        <div className="section-heading">
          <p className="kicker">Ad-ready use cases</p>
          <h2>Target cocktail and kitchen buyers, not recreational use.</h2>
          <p>
            Send ads here when the buyer intent is cocktails, espumas, whipped
            cream, dessert service, cafe cold foam, catering prep, or restaurant
            stock across {country.cities.slice(0, 3).join(", ")}, and the rest of{" "}
            {country.name}.
          </p>
        </div>

        <div className="use-case-grid">
          {product.useCases.map((useCase) => (
            <article className="use-case-card" key={useCase}>
              <Check size={18} />
              <h3>{useCase}</h3>
              <p>
                Position {product.shortName} for culinary preparation, menu
                consistency, and service speed.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="ad-angle-section">
        <div className="ad-angle-copy">
          <p className="kicker">Campaign positioning</p>
          <h2>Copy angles for this product page.</h2>
        </div>
        <div className="ad-angle-list">
          {product.adAngles.map((angle) => (
            <p key={angle}>
              <Check size={16} />
              {angle}
            </p>
          ))}
        </div>
      </section>

      <section id="specs" className="section specs-section">
        <div className="section-heading">
          <p className="kicker">Specs and checks</p>
          <h2>Clear product info for serious food-service buyers.</h2>
        </div>
        <div className="spec-grid">
          {product.specs.map(([label, value]) => (
            <div className="spec" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section id="order" className="section source-section">
        <div className="source-panel product-order-panel">
          <div>
            <p className="kicker">Order {product.shortName}</p>
            <h2>
              {money(price, country.code)} for {product.unit}.
            </h2>
            <p>
              Message us on WhatsApp to order for culinary use in bars, cafes,
              restaurants, bakeries, catering teams, and food-service operations
              across {country.name}, with dispatch from {country.capital}.
            </p>
            <div className="source-list">
              {sourceNotes.map((note) => (
                <p key={note}>
                  <Check size={16} />
                  {note}
                </p>
              ))}
            </div>
          </div>
          <div className="order-card">
            <strong>{product.name}</strong>
            <span>
              {money(price, country.code)} · {product.unit}
            </span>
            <MetaTrackedLink
              className="checkout-button"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              eventName="InitiateCheckout"
              eventPayload={{
                content_name: product.name,
                content_category: "product",
                content_ids: [product.contentId || product.id],
                content_type: "product",
                currency: country.currency,
                value: price,
              }}
            >
              <MessageCircle size={18} />
              Order Now on WhatsApp
            </MetaTrackedLink>
            <p>
              Food-service and culinary applications only. Nitrous oxide must
              never be inhaled or used recreationally.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <strong>{country.brandName}</strong>
        <span>
          {country.domain}
          {path}
        </span>
        <a href={`mailto:${country.email}`}>{country.email}</a>
        <CountrySwitcher country={country.code} path={path} />
      </footer>
    </main>
  );
}
