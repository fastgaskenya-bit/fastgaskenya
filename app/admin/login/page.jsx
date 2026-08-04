"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            background: "#0b0b0b",
            color: "#888",
            fontFamily: "system-ui, -apple-system, sans-serif",
            fontSize: 14,
          }}
        >
          Loading…
        </main>
      }
    >
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const nextPath = params.get("next") || "/admin/analytics";
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password, next: nextPath }),
      });
      const j = await r.json();
      if (!r.ok) {
        setErr(j.reason === "bad_password" ? "Wrong password" : "Server error");
        return;
      }
      router.push(j.next || "/admin/analytics");
      router.refresh();
    } catch {
      setErr("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0b0b",
        color: "#fff",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <form
        onSubmit={submit}
        style={{
          background: "#151515",
          padding: 32,
          borderRadius: 12,
          width: 320,
          border: "1px solid #262626",
        }}
      >
        <h1 style={{ margin: 0, marginBottom: 16, fontSize: 20 }}>Admin sign-in</h1>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #333",
            background: "#0b0b0b",
            color: "#fff",
            fontSize: 15,
            marginBottom: 12,
          }}
        />
        <button
          disabled={busy}
          style={{
            width: "100%",
            padding: "10px 12px",
            borderRadius: 8,
            border: "none",
            background: "#e8422f",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          {busy ? "Signing in..." : "Sign in"}
        </button>
        {err ? (
          <p style={{ marginTop: 12, color: "#f88", fontSize: 13 }}>{err}</p>
        ) : null}
      </form>
    </main>
  );
}
