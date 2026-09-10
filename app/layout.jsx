import Script from "next/script";
import "./globals.css";
import Tracker from "./components/Tracker";

const productImage =
  "https://fast-gas.com/wp-content/uploads/2022/07/PRODUCT-PAGE_670_front-view-e1764672680684.png";

// Market-specific metadata (title, description, canonical, hreflang, schema)
// lives in app/[country]/layout.jsx. This root layout only carries what is
// shared by every route, including the admin area.
export const metadata = {
  title: {
    default: "FastGas | N2O Cream Chargers",
    template: "%s | FastGas",
  },
  description:
    "Genuine FastGas Original 670g food-grade N2O cream charger cylinders for bars, cafes, restaurants, and caterers.",
  applicationName: "FastGas",
  category: "Food-service equipment",
  icons: { icon: "/icon.svg" },
  openGraph: {
    images: [{ url: productImage, width: 1200, height: 996 }],
  },
};

export default function RootLayout({ children }) {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID;
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
        {clarityId ? (
          <Script
            id="ms-clarity"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
                })(window, document, "clarity", "script", "${clarityId}");
              `,
            }}
          />
        ) : null}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=2051331792132670&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <Tracker />
        {children}
      </body>
    </html>
  );
}
