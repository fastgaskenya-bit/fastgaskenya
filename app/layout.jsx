import Script from "next/script";
import "./globals.css";

const siteUrl = "https://fastgaskenya.shop";
const productImage =
  "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_front-view-e1764672680684.png";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "FastGas Kenya | Buy N2O Cream Chargers in Nairobi",
    template: "%s | FastGas Kenya",
  },
  description:
    "Buy genuine FastGas Original 670g food-grade N2O cream charger cylinders in Kenya. Single cans or sealed cases of 6 for bars, cafes, restaurants, and caterers. Order on WhatsApp for fast Nairobi dispatch.",
  keywords: [
    "FastGas Kenya",
    "N2O cream chargers Kenya",
    "cream chargers Nairobi",
    "buy N2O cylinder Kenya",
    "whipped cream chargers Kenya",
    "FastGas 670g",
    "cocktail espuma chargers",
    "nitrous oxide cream charger Nairobi",
  ],
  authors: [{ name: "FastGas Kenya" }],
  applicationName: "FastGas Kenya",
  category: "Food-service equipment",
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "FastGas Kenya | Buy N2O Cream Chargers in Nairobi",
    description:
      "FastGas Original 670g cream charger cylinders, single cans and cases of six, for Kenya's bars, cafes, and caterers.",
    url: siteUrl,
    siteName: "FastGas Kenya",
    images: [
      {
        url: productImage,
        width: 1200,
        height: 996,
        alt: "FastGas Original 670g N2O cream charger cylinder",
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FastGas Kenya | Buy N2O Cream Chargers in Nairobi",
    description:
      "Genuine FastGas Original 670g N2O cream charger cylinders. Order on WhatsApp for fast Nairobi dispatch.",
    images: [productImage],
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FastGas Kenya",
  url: siteUrl,
  logo: productImage,
  description:
    "Retailer of FastGas Original 670g food-grade N2O cream charger cylinders for Kenya's bars, cafes, restaurants, and caterers.",
  areaServed: "KE",
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "sales",
    telephone: "+254704129897",
    areaServed: "KE",
    availableLanguage: ["en"],
  },
  sameAs: [],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Script
          id="meta-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '2051331792132670');
              fbq('track', 'PageView');
            `,
          }}
        />
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2051331792132670&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
