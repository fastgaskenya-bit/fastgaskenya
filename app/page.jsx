"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  Check,
  ChevronRight,
  CookingPot,
  MessageCircle,
  Minus,
  PackageCheck,
  Plus,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
  X,
} from "lucide-react";
import { getOrderMailto, getOrderWhatsapp, money, products, sharedSpecs, sourceNotes } from "../lib/catalog";

export default function Home() {
  const [cart, setCart] = useState({ "single-can": 1, "case-six": 0 });
  const [cartOpen, setCartOpen] = useState(false);

  const lineItems = useMemo(
    () =>
      products
        .map((product) => ({
          ...product,
          quantity: cart[product.id] || 0,
          total: (cart[product.id] || 0) * product.price,
        }))
        .filter((item) => item.quantity > 0),
    [cart],
  );

  const total = lineItems.reduce((sum, item) => sum + item.total, 0);
  const itemCount = lineItems.reduce((sum, item) => sum + item.quantity, 0);

  const updateQuantity = (id, change) => {
    setCart((current) => ({
      ...current,
      [id]: Math.max(0, (current[id] || 0) + change),
    }));
  };

  const mailtoHref = useMemo(() => {
    return getOrderMailto(lineItems);
  }, [lineItems]);

  const whatsappHref = useMemo(() => {
    return getOrderWhatsapp(lineItems);
  }, [lineItems]);

  return (
    <main>
      <header className="site-header">
        <a className="brand" href="#top" aria-label="FastGas Kenya home">
          <span className="brand-mark">F&gt;G</span>
          <span>
            FastGas
            <small>Kenya</small>
          </span>
        </a>
        <nav aria-label="Primary navigation">
          <a href="#shop">Shop</a>
          <a href="#verify">Verify</a>
          <a href="#specs">Specs</a>
        </nav>
        <button className="cart-button" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={18} />
          <span>Cart</span>
          <strong>{itemCount}</strong>
        </button>
      </header>

      <section id="top" className="hero">
        <div className="hero-copy">
          <p className="kicker">
            <Sparkles size={16} />
            fastgaskenya.shop
          </p>
          <h1>FastGas Original 670g for Kenya’s kitchens, bars, and events.</h1>
          <p className="hero-lede">
            Premium food-service N2O cream charger cylinders for whipped cream,
            espumas, sauces, and cocktail programs. Order single cans or sealed
            cases of six with clear pricing.
          </p>
          <div className="hero-actions">
            <a
              className="primary-action"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MessageCircle size={18} /> Order Now
            </a>
            <a className="secondary-action" href="#shop">
              Shop prices <ChevronRight size={18} />
            </a>
          </div>
          <div className="price-strip" aria-label="Featured prices">
            <span>
              Can <strong>KSh 5,000</strong>
            </span>
            <span>
              Pack of 6 <strong>KSh 29,000</strong>
            </span>
          </div>
        </div>

        <div className="hero-product" aria-label="FastGas Original product visual">
          <div className="product-halo" />
          <Image
            priority
            src="https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_front-view-e1764672680684.png"
            alt="FastGas Original 670g N2O cylinder"
            width={720}
            height={598}
            className="hero-can"
          />
          <div className="floating-note note-one">
            <BadgeCheck size={18} />
            QR authenticity
          </div>
          <div className="floating-note note-two">
            <PackageCheck size={18} />
            6 units per case
          </div>
        </div>
      </section>

      <section className="trust-band" aria-label="Service promises">
        <div>
          <Truck />
          Nairobi dispatch
        </div>
        <div>
          <ShieldCheck />
          Food-service focus
        </div>
        <div>
          <ScanLine />
          Bottle verification
        </div>
        <div>
          <CookingPot />
          Culinary use only
        </div>
      </section>

      <section id="shop" className="section shop-section">
        <div className="section-heading">
          <p className="kicker">Shop FastGas N2O</p>
          <h2>Simple pricing, clean checkout.</h2>
          <p>
            Build your order, then message us on WhatsApp. Payments and
            delivery are confirmed directly after order review.
          </p>
        </div>

        <div className="product-grid">
          {products.map((product) => (
            <article className="product-card" key={product.id}>
              <div className="product-image">
                <Image src={product.image} alt={product.alt} width={500} height={500} />
              </div>
              <div className="product-info">
                <span className="pill">{product.eyebrow}</span>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <ul>
                  {product.details.map((detail) => (
                    <li key={detail}>
                      <Check size={15} />
                      {detail}
                    </li>
                  ))}
                </ul>
                <Link className="details-link" href={`/products/${product.slug}`}>
                  Product ad page <ChevronRight size={16} />
                </Link>
              </div>
              <div className="product-buy">
                <span>
                  <strong>{money(product.price)}</strong>
                  <small>{product.unit}</small>
                </span>
                <div className="stepper" aria-label={`${product.name} quantity`}>
                  <button onClick={() => updateQuantity(product.id, -1)} aria-label="Decrease quantity">
                    <Minus size={16} />
                  </button>
                  <output>{cart[product.id] || 0}</output>
                  <button onClick={() => updateQuantity(product.id, 1)} aria-label="Increase quantity">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="verify" className="verify-section">
        <div className="verify-media">
          <Image
            src="https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_-box-600x600.png"
            alt="FastGas 670g carton packaging"
            width={600}
            height={600}
          />
        </div>
        <div className="verify-copy">
          <p className="kicker">Original product checks</p>
          <h2>Buy with the authenticity cues FastGas publishes.</h2>
          <p>
            The official brand warns about copycats and points buyers to checks
            such as the bottle QR code, laser engraving, unique barcode digits,
            and consistent fill capacity.
          </p>
          <div className="check-list">
            {["Scan QR code on bottle", "Check laser engraving", "Confirm unique barcode", "Use food-service equipment"].map(
              (item) => (
                <span key={item}>
                  <Check size={16} />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </section>

      <section id="specs" className="section specs-section">
        <div className="section-heading">
          <p className="kicker">Product specs</p>
          <h2>Built for high-volume cream, foam, and espuma work.</h2>
        </div>
        <div className="spec-grid">
          {sharedSpecs.map(([label, value]) => (
            <div className="spec" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </section>

      <section className="section source-section">
        <div className="source-panel">
          <p className="kicker">Sourced product info</p>
          <h2>What the site copy is based on.</h2>
          <div className="source-list">
            {sourceNotes.map((note) => (
              <p key={note}>
                <Check size={16} />
                {note}
              </p>
            ))}
          </div>
          <p className="responsible">
            FastGas Kenya is presented for culinary and authorised business use.
            Nitrous oxide must be handled responsibly, kept away from children,
            and never inhaled.
          </p>
        </div>
      </section>

      <footer>
        <strong>FastGas Kenya</strong>
        <span>fastgaskenya.shop</span>
        <a href={mailtoHref}>orders@fastgaskenya.shop</a>
      </footer>

      <aside className={`cart-drawer ${cartOpen ? "open" : ""}`} aria-hidden={!cartOpen}>
        <div className="cart-scrim" onClick={() => setCartOpen(false)} />
        <div className="cart-panel" role="dialog" aria-modal="true" aria-label="Shopping cart">
          <div className="cart-top">
            <div>
              <p className="kicker">Your order</p>
              <h2>FastGas cart</h2>
            </div>
            <button className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart">
              <X size={20} />
            </button>
          </div>

          <div className="cart-lines">
            {lineItems.length === 0 ? (
              <p className="empty-cart">Your cart is empty. Add a can or a case to start an order.</p>
            ) : (
              lineItems.map((item) => (
                <div className="cart-line" key={item.id}>
                  <div>
                    <strong>{item.name}</strong>
                    <span>
                      {item.quantity} x {money(item.price)}
                    </span>
                  </div>
                  <b>{money(item.total)}</b>
                </div>
              ))
            )}
          </div>

          <div className="cart-total">
            <span>Total</span>
            <strong>{money(total)}</strong>
          </div>

          <a
            className="checkout-button"
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle size={18} />
            Order Now
          </a>
          <p className="cart-note">
            Delivery, stock confirmation, and payment instructions are finalized
            after order review.
          </p>
        </div>
      </aside>
    </main>
  );
}
