import { notFound } from "next/navigation";
import {
  COUNTRY_CODES,
  alternateLanguages,
  getCountry,
  isCountryCode,
} from "../../lib/countries";

const productImage =
  "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_front-view-e1764672680684.png";

export function generateStaticParams() {
  return COUNTRY_CODES.map((country) => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country: code } = await params;
  if (!isCountryCode(code)) return {};
  const country = getCountry(code);

  return {
    metadataBase: new URL(country.siteUrl),
    title: {
      default: country.seo.title,
      template: `%s | ${country.brandName}`,
    },
    description: country.seo.description,
    keywords: country.seo.keywords,
    authors: [{ name: country.brandName }],
    applicationName: country.brandName,
    category: "Food-service equipment",
    alternates: {
      canonical: "/",
      languages: alternateLanguages("/"),
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
      title: country.seo.title,
      description: country.seo.ogDescription,
      url: country.siteUrl,
      siteName: country.brandName,
      images: [
        {
          url: productImage,
          width: 1200,
          height: 996,
          alt: "FastGas Original 670g N2O cream charger cylinder",
        },
      ],
      locale: country.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: country.seo.title,
      description: country.seo.twitterDescription,
      images: [productImage],
    },
  };
}

export default async function CountryLayout({ children, params }) {
  const { country: code } = await params;
  if (!isCountryCode(code)) notFound();
  const country = getCountry(code);

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: country.brandName,
    url: country.siteUrl,
    logo: productImage,
    description: `Retailer of FastGas Original 670g food-grade N2O cream charger cylinders for ${country.possessive} bars, cafes, restaurants, and caterers.`,
    areaServed: {
      "@type": "Country",
      name: country.name,
      identifier: country.iso,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: `+${country.whatsapp}`,
      areaServed: country.iso,
      availableLanguage: ["en"],
    },
    sameAs: [country.instagramUrl],
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "OnlineStore",
    name: country.brandName,
    url: country.siteUrl,
    image: productImage,
    email: country.email,
    telephone: `+${country.whatsapp}`,
    currenciesAccepted: country.currency,
    areaServed: country.cities.map((city) => ({
      "@type": "City",
      name: city,
    })),
    address: {
      "@type": "PostalAddress",
      addressLocality: country.capital,
      addressCountry: country.iso,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {children}
    </>
  );
}
