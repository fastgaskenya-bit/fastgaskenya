import { products } from "../lib/catalog";

export default function sitemap() {
  const siteUrl = "https://fastgaskenya.shop";
  const now = new Date();

  const routes = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...products.map((product) => ({
      url: `${siteUrl}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  ];

  return routes;
}
