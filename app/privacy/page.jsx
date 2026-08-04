export const metadata = {
  title: "Privacy Policy",
  description:
    "How FastGas Kenya collects, uses, and stores visitor and customer information.",
  alternates: { canonical: "/privacy" },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  const updated = "August 4, 2026";
  return (
    <main
      style={{
        maxWidth: 780,
        margin: "0 auto",
        padding: "48px 24px 96px",
        color: "#1a1a1a",
        lineHeight: 1.6,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <a href="/" style={{ color: "#e8422f", textDecoration: "none", fontSize: 14 }}>
        ← Back to store
      </a>
      <h1 style={{ marginTop: 16 }}>Privacy Policy</h1>
      <p style={{ color: "#666", fontSize: 14 }}>Last updated: {updated}</p>

      <p>
        FastGas Kenya (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates{" "}
        <strong>fastgaskenya.shop</strong>. This policy explains what information we
        collect about visitors and customers, how we use it, and your rights under
        Kenya&apos;s Data Protection Act, 2019.
      </p>

      <h2>1. Information we collect automatically</h2>
      <p>
        When you visit our site we automatically log the following technical data,
        used to secure the site, prevent abuse, and understand how the site is used:
      </p>
      <ul>
        <li>
          <strong>Network data:</strong> IP address, approximate location derived
          from the IP (country, region, city), internet service provider (ISP),
          autonomous-system number (ASN), and whether the IP is associated with a
          known VPN, proxy, or hosting provider.
        </li>
        <li>
          <strong>Device data:</strong> user-agent string, device type, browser,
          operating system, screen resolution, viewport size, language, timezone,
          and connection type.
        </li>
        <li>
          <strong>Interaction data:</strong> pages visited, order and time of
          visits, referring URL (the page or app that sent you here), UTM
          campaign parameters, click positions on the page, and the elements you
          clicked.
        </li>
        <li>
          <strong>Session identifier:</strong> a random ID stored in your browser
          session storage that lets us link the pageviews and clicks belonging to
          the same visit. It is not linked to your name, email, or phone.
        </li>
      </ul>

      <h2>2. Information you give us</h2>
      <p>
        If you contact us — including by WhatsApp, email, or by placing an order —
        we receive the phone number, name, delivery address, or other information
        you share, and use it only to fulfil your order or answer your enquiry.
      </p>

      <h2>3. Why we collect this data</h2>
      <ul>
        <li>
          <strong>Order fulfilment:</strong> processing and delivering purchases.
        </li>
        <li>
          <strong>Security &amp; abuse prevention:</strong> detecting bots,
          suspicious activity, and misuse of the site.
        </li>
        <li>
          <strong>Analytics &amp; product improvement:</strong> understanding
          which products, pages, and campaigns work best.
        </li>
        <li>
          <strong>Advertising measurement:</strong> attributing sales to
          marketing activity (via Meta Pixel — see section 5).
        </li>
      </ul>

      <h2>4. How long we keep it</h2>
      <ul>
        <li>
          <strong>Raw IP address:</strong> up to 30 days, then automatically
          deleted. A one-way hashed IP is retained for aggregate visitor
          counting.
        </li>
        <li>
          <strong>Other analytics data</strong> (device, browser, geo at
          country/city level, page paths, clicks): retained in aggregate for as
          long as it is useful for security and product analytics.
        </li>
        <li>
          <strong>Order and communication records:</strong> kept for as long as
          required to run our business and comply with Kenyan tax and consumer
          law.
        </li>
      </ul>

      <h2>5. Third parties we share data with</h2>
      <ul>
        <li>
          <strong>Google Firebase (Firestore):</strong> hosts our analytics
          database. Google acts as a data processor on our behalf.
        </li>
        <li>
          <strong>Meta Pixel (Facebook / Instagram):</strong> loaded on all pages
          to measure ad performance. Meta receives your IP, user-agent, and the
          pages you view on our site. See Meta&apos;s privacy policy at{" "}
          <a href="https://www.facebook.com/privacy/policy" rel="noopener noreferrer" target="_blank">
            facebook.com/privacy/policy
          </a>
          .
        </li>
        <li>
          <strong>ipinfo.io:</strong> we may look up your IP address with ipinfo
          to identify ISP and approximate location for security purposes.
        </li>
        <li>
          <strong>Vercel:</strong> our hosting provider. Standard server access
          logs are processed by Vercel.
        </li>
      </ul>
      <p>
        We do <strong>not</strong> sell your personal data. We do not share your
        data with any party other than the processors above.
      </p>

      <h2>6. Cookies and browser storage</h2>
      <p>
        We use <em>sessionStorage</em> (cleared when you close the tab) to hold a
        random session ID and a first-page-visited record. We do not use
        persistent tracking cookies of our own. Meta Pixel may set its own
        cookies — you can control these through your browser settings.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Under the Data Protection Act, 2019 you have the right to:
      </p>
      <ul>
        <li>Ask what personal data we hold about you.</li>
        <li>Ask us to correct or delete your personal data.</li>
        <li>Object to or restrict specific uses of your data.</li>
        <li>
          Complain to the Office of the Data Protection Commissioner (
          <a href="https://www.odpc.go.ke" rel="noopener noreferrer" target="_blank">
            odpc.go.ke
          </a>
          ).
        </li>
      </ul>

      <h2>8. Contact</h2>
      <p>
        For any privacy question or to exercise the rights above, email{" "}
        <a href="mailto:fastgaskenya@gmail.com">fastgaskenya@gmail.com</a>.
      </p>

      <h2>9. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &quot;Last updated&quot;
        date at the top shows when it last changed.
      </p>
    </main>
  );
}
