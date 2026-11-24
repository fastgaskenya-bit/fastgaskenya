"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const emptyData = { products: [], prices: {} };

export default function PricesPage() {
  const [data, setData] = useState(emptyData);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const response = await fetch("/api/admin/prices", { cache: "no-store" });
        const json = await response.json();
        if (!response.ok) throw new Error(json.message || "Could not load prices.");
        setData({ products: json.products, prices: json.prices });
        setStatus("ready");
      } catch (error) {
        setMessage(error.message || "Could not load prices.");
        setStatus("error");
      }
    }
    load();
  }, []);

  function updatePrice(productId, market, value) {
    setData((current) => ({
      ...current,
      prices: {
        ...current.prices,
        [productId]: { ...current.prices[productId], [market]: value },
      },
    }));
  }

  async function save(event) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");
    try {
      const prices = Object.fromEntries(
        Object.entries(data.prices).map(([id, values]) => [
          id,
          { ke: Number(values.ke), ug: Number(values.ug) },
        ]),
      );
      const response = await fetch("/api/admin/prices", {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ prices }),
      });
      const json = await response.json();
      if (!response.ok) throw new Error(json.message || "Could not save prices.");
      setData((current) => ({ ...current, prices: json.prices }));
      setMessage("Prices saved. Both storefronts now use the new values.");
      setStatus("ready");
    } catch (error) {
      setMessage(error.message || "Could not save prices.");
      setStatus("error");
    }
  }

  return (
    <main style={pageStyle}>
      <header style={headerStyle}>
        <div>
          <p style={eyebrowStyle}>FastGas admin</p>
          <h1 style={{ margin: 0, fontSize: 24 }}>Product prices</h1>
          <p style={subtleStyle}>
            Update Kenya and Uganda independently. Changes go live immediately.
          </p>
        </div>
        <Link href="/admin/analytics" style={linkStyle}>← Analytics</Link>
      </header>

      <form onSubmit={save} style={cardStyle}>
        <div style={tableWrapStyle}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={headCellStyle}>Product</th>
                <th style={headCellStyle}>Kenya (KES)</th>
                <th style={headCellStyle}>Uganda (UGX)</th>
              </tr>
            </thead>
            <tbody>
              {data.products.map((product) => (
                <tr key={product.id}>
                  <td style={cellStyle}>
                    <strong>{product.name}</strong>
                    <div style={subtleStyle}>{product.unit}</div>
                  </td>
                  <td style={cellStyle}>
                    <PriceInput value={data.prices[product.id]?.ke ?? ""} onChange={(value) => updatePrice(product.id, "ke", value)} prefix="KSh" />
                  </td>
                  <td style={cellStyle}>
                    <PriceInput value={data.prices[product.id]?.ug ?? ""} onChange={(value) => updatePrice(product.id, "ug", value)} prefix="UGX" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {message ? <p style={{ ...messageStyle, color: status === "error" ? "#ff9b9b" : "#a9e7b1" }}>{message}</p> : null}
        <button type="submit" disabled={status === "loading" || status === "saving" || !data.products.length} style={buttonStyle}>
          {status === "saving" ? "Saving…" : "Save prices"}
        </button>
      </form>
    </main>
  );
}

function PriceInput({ value, onChange, prefix }) {
  return (
    <label style={priceInputWrapStyle}>
      <span style={{ color: "#999", fontSize: 12, padding: "0 8px 0 10px" }}>{prefix}</span>
      <input required min="1" step="1" inputMode="numeric" type="number" value={value} onChange={(event) => onChange(event.target.value)} style={priceInputStyle} />
    </label>
  );
}

const pageStyle = { minHeight: "100vh", background: "#0b0b0b", color: "#eaeaea", fontFamily: "system-ui, -apple-system, sans-serif", padding: "24px 32px 64px" };
const headerStyle = { display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24 };
const eyebrowStyle = { color: "#e8422f", fontSize: 12, fontWeight: 700, letterSpacing: 0.8, margin: "0 0 6px", textTransform: "uppercase" };
const subtleStyle = { color: "#999", fontSize: 13, margin: "6px 0 0" };
const linkStyle = { color: "#e8422f", textDecoration: "none", fontWeight: 600, fontSize: 14 };
const cardStyle = { maxWidth: 900, background: "#141414", border: "1px solid #262626", borderRadius: 12, padding: 20 };
const tableWrapStyle = { overflowX: "auto" };
const tableStyle = { width: "100%", borderCollapse: "collapse", minWidth: 640 };
const headCellStyle = { color: "#999", borderBottom: "1px solid #303030", fontSize: 12, letterSpacing: 0.4, padding: "0 12px 12px", textAlign: "left", textTransform: "uppercase" };
const cellStyle = { borderBottom: "1px solid #242424", padding: "16px 12px", verticalAlign: "middle" };
const priceInputWrapStyle = { alignItems: "center", background: "#0c0c0c", border: "1px solid #383838", borderRadius: 8, display: "flex", overflow: "hidden", width: 180 };
const priceInputStyle = { background: "transparent", border: 0, color: "#fff", fontSize: 15, outline: "none", padding: "10px 12px 10px 0", width: "100%" };
const messageStyle = { fontSize: 14, margin: "18px 0 0" };
const buttonStyle = { background: "#e8422f", border: 0, borderRadius: 8, color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, marginTop: 20, padding: "11px 16px" };
