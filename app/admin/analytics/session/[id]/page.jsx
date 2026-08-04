"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SessionPage() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch(`/api/admin/session/${id}`, { cache: "no-store" });
        const j = await r.json();
        if (!r.ok) throw new Error(j.message || j.reason || "error");
        setData(j);
      } catch (e) {
        setErr(String(e.message || e));
      }
    })();
  }, [id]);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0b0b0b",
        color: "#eaeaea",
        fontFamily: "system-ui, -apple-system, sans-serif",
        padding: "24px 32px 64px",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <Link href="/admin/analytics" style={{ color: "#e8422f", textDecoration: "none" }}>
          ← Back to dashboard
        </Link>
      </div>
      <h1 style={{ margin: 0, fontSize: 20 }}>Session {String(id).slice(0, 12)}…</h1>

      {err ? <ErrorBox msg={err} /> : null}
      {!data && !err ? <div style={{ color: "#888", marginTop: 16 }}>Loading…</div> : null}

      {data ? (
        <>
          <Section title="Visitor profile">
            <ProfileGrid p={data.profile} totals={data.totals} />
          </Section>

          <Section title="Landing">
            {data.profile.landing ? (
              <KVList
                rows={[
                  ["Landing URL", data.profile.landing.url],
                  ["Referrer", data.profile.landing.referrer || "—"],
                  ["UTM", data.profile.landing.utm ? JSON.stringify(data.profile.landing.utm) : "—"],
                  [
                    "Landed at",
                    data.profile.landing.landedAt
                      ? new Date(data.profile.landing.landedAt).toLocaleString()
                      : "—",
                  ],
                ]}
              />
            ) : (
              <div style={{ color: "#888" }}>No landing info recorded.</div>
            )}
          </Section>

          <Section title={`Event stream (${data.events.length})`}>
            <EventTable events={data.events} />
          </Section>

          <Section title="Raw user-agent">
            <pre
              style={{
                margin: 0,
                fontSize: 12,
                color: "#aaa",
                whiteSpace: "pre-wrap",
                wordBreak: "break-all",
              }}
            >
              {data.profile.ua || "—"}
            </pre>
          </Section>
        </>
      ) : null}
    </main>
  );
}

function Section({ title, children }) {
  return (
    <section
      style={{
        background: "#141414",
        border: "1px solid #262626",
        borderRadius: 12,
        padding: 16,
        marginTop: 16,
      }}
    >
      <h2 style={{ margin: "0 0 12px", fontSize: 14, color: "#bbb", fontWeight: 600 }}>{title}</h2>
      {children}
    </section>
  );
}

function ProfileGrid({ p, totals }) {
  const rows = [
    ["IP", p.ip || "(purged)"] ,
    ["ISP / Org", p.network?.org ? `${p.network.org} (${p.network.asn || "?"})` : "—"],
    ["Hostname", p.network?.hostname || "—"],
    ["VPN / hosting", p.network?.isVpnLikely ? "⚠ Likely" : "No / unknown"],
    ["Country", p.country || "—"],
    ["Region", p.region || "—"],
    ["City", p.city || "—"],
    ["Lat / Lon", p.geo?.lat != null ? `${p.geo.lat}, ${p.geo.lon}` : "—"],
    ["Device", `${p.device || "?"}${p.deviceModel ? " · " + p.deviceModel : ""}${p.deviceVendor ? " · " + p.deviceVendor : ""}`],
    ["Browser", `${p.browser || "?"} ${p.browserVersion || ""}`.trim()],
    ["OS", `${p.os || "?"} ${p.osVersion || ""}`.trim()],
    ["Language", p.language || "—"],
    ["Timezone", p.timezone || "—"],
    ["Screen", p.screen ? `${p.screen.w}×${p.screen.h} @${p.screen.dpr || 1}x` : "—"],
    ["Viewport", p.viewport ? `${p.viewport.w}×${p.viewport.h}` : "—"],
    ["Connection", p.connection?.type ? `${p.connection.type} · ${p.connection.downlink ?? "?"}Mbps` : "—"],
    ["First seen", p.firstSeen ? new Date(p.firstSeen).toLocaleString() : "—"],
    ["Last seen", p.lastSeen ? new Date(p.lastSeen).toLocaleString() : "—"],
    ["Duration", totals.durationMs ? `${Math.round(totals.durationMs / 1000)}s` : "—"],
    ["Pageviews / clicks", `${totals.pageviews} / ${totals.clicks}`],
  ];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "6px 24px" }}>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ color: "#888" }}>{k}</span>
          <span style={{ color: "#eaeaea", textAlign: "right", maxWidth: "60%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {v}
          </span>
        </div>
      ))}
    </div>
  );
}

function KVList({ rows }) {
  return (
    <div>
      {rows.map(([k, v]) => (
        <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 13, padding: "4px 0", borderBottom: "1px solid #1c1c1c" }}>
          <span style={{ color: "#888" }}>{k}</span>
          <span style={{ color: "#eaeaea", maxWidth: "70%", wordBreak: "break-all", textAlign: "right" }}>{v}</span>
        </div>
      ))}
    </div>
  );
}

function EventTable({ events }) {
  return (
    <div style={{ maxHeight: 480, overflow: "auto", border: "1px solid #222", borderRadius: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#1a1a1a", position: "sticky", top: 0 }}>
            <th style={th}>Time</th>
            <th style={th}>Type</th>
            <th style={th}>Path</th>
            <th style={th}>Target</th>
            <th style={th}>Coords</th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} style={{ borderTop: "1px solid #1a1a1a" }}>
              <td style={td}>{e.clientTs ? new Date(e.clientTs).toLocaleTimeString() : "—"}</td>
              <td style={{ ...td, color: e.type === "click" ? "#e8422f" : "#8bc" }}>{e.type}</td>
              <td style={td}>{e.path}</td>
              <td style={td}>
                {e.target
                  ? `${e.target.tag}${e.target.id ? "#" + e.target.id : ""} — ${e.target.text || ""}`
                  : "—"}
              </td>
              <td style={td}>{e.x != null ? `${e.x}, ${e.y}` : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const th = {
  textAlign: "left",
  padding: "8px 10px",
  color: "#888",
  fontWeight: 600,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const td = { padding: "6px 10px", color: "#ddd", verticalAlign: "top" };

function ErrorBox({ msg }) {
  return (
    <div
      style={{
        background: "#3a1414",
        border: "1px solid #663",
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
      }}
    >
      Error: {msg}
    </div>
  );
}
