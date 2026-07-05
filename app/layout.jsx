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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
