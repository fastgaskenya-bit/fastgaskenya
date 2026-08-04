"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

export default function AnalyticsPage() {
  const [hours, setHours] = useState(24);
  const [pathFilter, setPathFilter] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setErr("");
    try {
      const q = new URLSearchParams({ hours: String(hours) });
      if (pathFilter) q.set("path", pathFilter);
      const r = await fetch(`/api/admin/analytics?${q}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok) throw new Error(j.message || j.reason || "error");
      setData(j);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }, [hours, pathFilter]);

  useEffect(() => {
    load();
  }, [load]);

  async function signOut() {
    await fetch("/api/admin/login", { method: "DELETE" });
    window.location.href = "/admin/login";
  }

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
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: 22 }}>FastGas Analytics</h1>
          <p style={{ margin: "4px 0 0", color: "#888", fontSize: 13 }}>
            Live traffic, devices, clicks — self-hosted.
          </p>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value, 10))}
            style={inputStyle}
          >
            <option value={1}>Last 1 hour</option>
            <option value={6}>Last 6 hours</option>
            <option value={24}>Last 24 hours</option>
            <option value={72}>Last 3 days</option>
            <option value={168}>Last 7 days</option>
            <option value={720}>Last 30 days</option>
          </select>
          <input
            placeholder="Filter path (e.g. /)"
            value={pathFilter}
            onChange={(e) => setPathFilter(e.target.value)}
            style={{ ...inputStyle, width: 220 }}
          />
          <button onClick={load} style={btnStyle}>
            Reload
          </button>
          <button onClick={signOut} style={{ ...btnStyle, background: "#333" }}>
            Sign out
          </button>
        </div>
      </header>

      {err ? (
        <div
          style={{
            background: "#3a1414",
            border: "1px solid #663",
            padding: 12,
            borderRadius: 8,
            marginBottom: 16,
          }}
        >
          Error: {err}
        </div>
      ) : null}

      {loading && !data ? (
        <div style={{ color: "#888" }}>Loading…</div>
      ) : data ? (
        <>
          <StatGrid totals={data.totals} rageCount={data.rageFlags.length} />
          <Section title="Traffic per hour">
            <HourlyBars hourly={data.hourly} />
          </Section>

          <div style={twoCol}>
            <Section title="Top pages">
              <BarList items={data.topPages} />
            </Section>
            <Section title="Countries">
              <BarList items={data.countries} />
            </Section>
          </div>

          <div style={threeCol}>
            <Section title="Devices">
              <BarList items={data.devices} />
            </Section>
            <Section title="Browsers">
              <BarList items={data.browsers} />
            </Section>
            <Section title="Operating systems">
              <BarList items={data.os} />
            </Section>
          </div>

          <Section title="Most-clicked elements">
            <BarList items={data.topClickTargets} />
          </Section>

          <Section title={`Recent sessions (${data.recentSessions?.length || 0})`}>
            <SessionTable sessions={data.recentSessions || []} />
          </Section>

          <Section title={`Rage-click flags (${data.rageFlags.length})`}>
            {data.rageFlags.length === 0 ? (
              <div style={{ color: "#888", fontSize: 13 }}>
                No sessions with 3+ rapid clicks in the same spot detected.
              </div>
            ) : (
              <div style={{ maxHeight: 240, overflow: "auto" }}>
                {data.rageFlags.map((r) => (
                  <div
                    key={r.sessionId + r.at}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "6px 0",
                      borderBottom: "1px solid #222",
                      fontSize: 13,
                    }}
                  >
                    <span style={{ color: "#f88" }}>{r.path}</span>
                    <span style={{ color: "#888" }}>
                      session {r.sessionId.slice(0, 8)} · {new Date(r.at).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Section>

          <Section
            title={
              pathFilter
                ? `Click heatmap — ${pathFilter} (${data.clickPoints.length} clicks)`
                : "Click heatmap"
            }
          >
            {pathFilter ? (
              <Heatmap points={data.clickPoints} />
            ) : (
              <div style={{ color: "#888", fontSize: 13 }}>
                Enter a path above (e.g. <code>/</code> or <code>/products/all-in-one-bundle</code>)
                to render the heatmap for that page.
              </div>
            )}
          </Section>
        </>
      ) : null}
    </main>
  );
}

/* ---------- helpers ---------- */

const inputStyle = {
  background: "#151515",
  color: "#eaeaea",
  border: "1px solid #333",
  padding: "8px 10px",
  borderRadius: 8,
  fontSize: 13,
};
const btnStyle = {
  background: "#e8422f",
  color: "#fff",
  border: "none",
  padding: "8px 14px",
  borderRadius: 8,
  fontSize: 13,
  cursor: "pointer",
  fontWeight: 600,
};
const twoCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: 16,
  marginBottom: 16,
};
const threeCol = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr 1fr",
  gap: 16,
  marginBottom: 16,
};

function Section({ title, children }) {
  return (
    <section
      style={{
        background: "#141414",
        border: "1px solid #262626",
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <h2 style={{ margin: "0 0 12px", fontSize: 14, color: "#bbb", fontWeight: 600 }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

function StatGrid({ totals, rageCount }) {
  const items = [
    ["Pageviews", totals.pageviews],
    ["Clicks", totals.clicks],
    ["Sessions", totals.sessions],
    ["Unique visitors", totals.uniqueVisitors],
    ["Rage sessions", rageCount],
  ];
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(5, 1fr)",
        gap: 12,
        marginBottom: 16,
      }}
    >
      {items.map(([label, v]) => (
        <div
          key={label}
          style={{
            background: "#141414",
            border: "1px solid #262626",
            padding: 16,
            borderRadius: 12,
          }}
        >
          <div style={{ color: "#888", fontSize: 12 }}>{label}</div>
          <div style={{ fontSize: 24, fontWeight: 700, marginTop: 4 }}>
            {v?.toLocaleString?.() ?? v ?? 0}
          </div>
        </div>
      ))}
    </div>
  );
}

function BarList({ items }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  if (!items.length) return <div style={{ color: "#888", fontSize: 13 }}>No data.</div>;
  return (
    <div>
      {items.map((it) => (
        <div key={it.key} style={{ marginBottom: 6 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 13,
              marginBottom: 2,
            }}
          >
            <span style={{ color: "#ddd", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "80%" }}>
              {it.key || "(empty)"}
            </span>
            <span style={{ color: "#888" }}>{it.count}</span>
          </div>
          <div style={{ height: 6, background: "#1e1e1e", borderRadius: 4 }}>
            <div
              style={{
                width: `${(it.count / max) * 100}%`,
                height: "100%",
                background: "#e8422f",
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function HourlyBars({ hourly }) {
  const max = Math.max(1, ...hourly.map((h) => h.count));
  if (!hourly.length) return <div style={{ color: "#888", fontSize: 13 }}>No data.</div>;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 3, height: 120 }}>
      {hourly.map((h) => (
        <div
          key={h.hour}
          title={`${h.hour}Z — ${h.count} events`}
          style={{
            flex: 1,
            height: `${(h.count / max) * 100}%`,
            background: "#e8422f",
            borderRadius: 2,
            minHeight: 2,
          }}
        />
      ))}
    </div>
  );
}

function SessionTable({ sessions }) {
  if (!sessions.length) return <div style={{ color: "#888", fontSize: 13 }}>No sessions.</div>;
  return (
    <div style={{ overflow: "auto", border: "1px solid #222", borderRadius: 8 }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
        <thead>
          <tr style={{ background: "#1a1a1a" }}>
            <th style={sth}>Last seen</th>
            <th style={sth}>IP</th>
            <th style={sth}>Country</th>
            <th style={sth}>City</th>
            <th style={sth}>ISP</th>
            <th style={sth}>VPN?</th>
            <th style={sth}>Device</th>
            <th style={sth}>Browser</th>
            <th style={sth}>Entry</th>
            <th style={sth}></th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((s) => (
            <tr key={s.sessionId} style={{ borderTop: "1px solid #1a1a1a" }}>
              <td style={std}>
                {s.lastSeen ? new Date(s.lastSeen).toLocaleTimeString() : "—"}
              </td>
              <td style={{ ...std, fontFamily: "monospace" }}>{s.ip || "—"}</td>
              <td style={std}>{s.country || "—"}</td>
              <td style={std}>{s.city || "—"}</td>
              <td style={std}>{s.org || "—"}</td>
              <td style={{ ...std, color: s.isVpnLikely ? "#f88" : "#888" }}>
                {s.isVpnLikely ? "⚠" : "—"}
              </td>
              <td style={std}>{s.device || "—"}</td>
              <td style={std}>{s.browser || "—"}</td>
              <td style={std}>{s.entryPath || "—"}</td>
              <td style={std}>
                <Link
                  href={`/admin/analytics/session/${s.sessionId}`}
                  style={{ color: "#e8422f", textDecoration: "none" }}
                >
                  View →
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
const sth = {
  textAlign: "left",
  padding: "8px 10px",
  color: "#888",
  fontWeight: 600,
  fontSize: 11,
  textTransform: "uppercase",
  letterSpacing: 0.5,
};
const std = { padding: "6px 10px", color: "#ddd", whiteSpace: "nowrap" };

function Heatmap({ points }) {
  const canvasRef = useRef(null);
  const width = 900;

  const { pageH, normPoints } = useMemo(() => {
    if (!points.length) return { pageH: 600, normPoints: [] };
    // Assume all points from the same path share roughly the same pageW/pageH.
    // Use the median pageW/pageH.
    const ws = points.map((p) => p.pageW || 1440).sort((a, b) => a - b);
    const hs = points.map((p) => p.pageH || 900).sort((a, b) => a - b);
    const pageW = ws[Math.floor(ws.length / 2)] || 1440;
    const pageH = hs[Math.floor(hs.length / 2)] || 900;
    const scale = width / pageW;
    const normPoints = points.map((p) => ({
      x: (p.x || 0) * scale,
      y: (p.y || 0) * scale,
    }));
    return { pageH: pageH * scale, normPoints };
  }, [points]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0f0f0f";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    // Draw radial-gradient dots and let them additively blend into a heat map.
    ctx.globalCompositeOperation = "lighter";
    for (const p of normPoints) {
      const r = 24;
      const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
      g.addColorStop(0, "rgba(232, 66, 47, 0.55)");
      g.addColorStop(1, "rgba(232, 66, 47, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }, [normPoints]);

  if (!points.length) {
    return (
      <div style={{ color: "#888", fontSize: 13 }}>No clicks recorded for this path.</div>
    );
  }
  return (
    <div style={{ overflow: "auto", border: "1px solid #262626", borderRadius: 8 }}>
      <canvas ref={canvasRef} width={width} height={pageH} style={{ display: "block" }} />
    </div>
  );
}
