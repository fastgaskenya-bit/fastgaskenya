import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://fastgaskenya.shop"),
  title: "FastGas Kenya | Premium N2O Cream Chargers",
  description:
    "Order FastGas Original 670g food-grade N2O cylinders for culinary, bar, cafe, and catering use in Kenya.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "FastGas Kenya",
    description:
      "FastGas Original 670g cream charger cylinders, single cans and cases of six.",
    url: "https://fastgaskenya.shop",
    siteName: "FastGas Kenya",
    images: [
      {
        url: "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_front-view-e1764672680684.png",
        width: 1200,
        height: 996,
      },
    ],
    locale: "en_KE",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
