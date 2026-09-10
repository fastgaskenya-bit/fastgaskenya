import { notFound } from "next/navigation";
import { COUNTRY_CODES, getCountry, isCountryCode } from "../../lib/countries";
import { alternateLanguages } from "../../lib/countries";
import { resolveFaqs } from "../../lib/catalog";
import HomeClient from "./home-client";

export function generateStaticParams() {
  return COUNTRY_CODES.map((country) => ({ country }));
}

export async function generateMetadata({ params }) {
  const { country: code } = await params;
  if (!isCountryCode(code)) return {};
  const country = getCountry(code);

  return {
    title: country.seo.title,
    description: country.seo.description,
    keywords: country.seo.keywords,
    alternates: {
      canonical: "/",
      languages: alternateLanguages("/"),
    },
    openGraph: {
      title: country.seo.title,
      description: country.seo.ogDescription,
      url: country.siteUrl,
      siteName: country.brandName,
      locale: country.ogLocale,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: country.seo.title,
      description: country.seo.twitterDescription,
    },
  };
}

export default async function CountryHomePage({ params }) {
  const { country: code } = await params;
  if (!isCountryCode(code)) notFound();

  const country = getCountry(code);
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: resolveFaqs(country).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <HomeClient country={code} />
    </>
  );
}
