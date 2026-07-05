import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CookingPot,
  Mail,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { getOrderMailto, getProductBySlug, money, products, sourceNotes } from "../../../lib/catalog";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    return {
      title: "FastGas Kenya Product",
    };
  }

  return {
    title: `${product.shortName} | FastGas Kenya`,
    description: `${product.name} for culinary cocktail foams, espumas, whipped cream, cafe, bar, and catering use in Kenya. ${money(product.price)}.`,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: `${product.shortName} - ${money(product.price)}`,
      description: product.detailDescription,
      url: `https://fastgaskenya.shop/products/${product.slug}`,
      siteName: "FastGas Kenya",
      images: [
        {
          url: product.image,
          width: 1200,
          height: 1200,
          alt: product.alt,
        },
      ],
      locale: "en_KE",
      type: "website",
    },
  };
}

export default async function ProductDetailPage({ params }) {
  const { slug } = await params;
  const product = getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const mailtoHref = getOrderMailto([{ ...product, quantity: 1, total: product.price }], product);
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
      priceCurrency: "KES",
      price: product.price,
      availability: "https://schema.org/InStock",
      url: `https://fastgaskenya.shop/products/${product.slug}`,
    },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="site-header">
        <Link className="brand" href="/" aria-label="FastGas Kenya home">
          <span className="brand-mark">F&gt;G</span>
          <span>
            FastGas
            <small>Kenya</small>
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
              Price <strong>{money(product.price)}</strong>
            </span>
            <span>
              Unit <strong>{product.unit}</strong>
            </span>
          </div>

          <div className="hero-actions">
            <a className="primary-action" href={mailtoHref}>
              Request invoice <Mail size={18} />
            </a>
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
          Kenya orders
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
            stock.
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
            <h2>{money(product.price)} for {product.unit}.</h2>
            <p>
              Request an invoice for culinary use in bars, cafes, restaurants,
              bakeries, catering teams, and food-service operations.
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
            <span>{money(product.price)} · {product.unit}</span>
            <a className="checkout-button" href={mailtoHref}>
              <Mail size={18} />
              Request invoice
            </a>
            <p>
              Food-service and culinary applications only. Nitrous oxide must
              never be inhaled or used recreationally.
            </p>
          </div>
        </div>
      </section>

      <footer>
        <strong>FastGas Kenya</strong>
        <span>fastgaskenya.shop/products/{product.slug}</span>
        <a href={mailtoHref}>orders@fastgaskenya.shop</a>
      </footer>
    </main>
  );
}
