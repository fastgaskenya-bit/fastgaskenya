"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

const SESSION_KEY = "fg_sid";
const LANDING_KEY = "fg_landing";
const ENDPOINT = "/api/track";

function getSessionId() {
  if (typeof window === "undefined") return "";
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id =
      (crypto.randomUUID && crypto.randomUUID()) ||
      Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getLanding() {
  if (typeof window === "undefined") return null;
  let landing = sessionStorage.getItem(LANDING_KEY);
  if (!landing) {
    const url = new URL(window.location.href);
    const utm = {};
    for (const [k, v] of url.searchParams.entries()) {
      if (k.startsWith("utm_") || k === "gclid" || k === "fbclid") utm[k] = v;
    }
    landing = JSON.stringify({
      url: window.location.href,
      referrer: document.referrer || null,
      utm,
      landedAt: Date.now(),
    });
    sessionStorage.setItem(LANDING_KEY, landing);
  }
  try {
    return JSON.parse(landing);
  } catch {
    return null;
  }
}

function envelope() {
  if (typeof window === "undefined") return {};
  const nav = navigator || {};
  const conn = nav.connection || nav.mozConnection || nav.webkitConnection || {};
  return {
    sessionId: getSessionId(),
    viewport: { w: window.innerWidth, h: window.innerHeight },
    screen: {
      w: window.screen?.width || null,
      h: window.screen?.height || null,
      dpr: window.devicePixelRatio || 1,
      colorDepth: window.screen?.colorDepth || null,
    },
    language: nav.language || null,
    languages: Array.isArray(nav.languages) ? nav.languages.slice(0, 5) : null,
    timezone:
      (Intl.DateTimeFormat().resolvedOptions?.() || {}).timeZone || null,
    connection: {
      type: conn.effectiveType || null,
      downlink: typeof conn.downlink === "number" ? conn.downlink : null,
      rtt: typeof conn.rtt === "number" ? conn.rtt : null,
      saveData: !!conn.saveData,
    },
    landing: getLanding(),
    ts: Date.now(),
  };
}

function send(payload) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      const blob = new Blob([body], { type: "application/json" });
      if (navigator.sendBeacon(ENDPOINT, blob)) return;
    }
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

export default function Tracker() {
  const pathname = usePathname();
  const enteredAtRef = useRef(Date.now());

  // Pageview
  useEffect(() => {
    if (typeof window === "undefined") return;
    enteredAtRef.current = Date.now();
    send({
      type: "pageview",
      path: pathname || window.location.pathname,
      referrer: document.referrer || null,
      ...envelope(),
    });
  }, [pathname]);

  // Clicks — throttled (max 1 per 100ms)
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastAt = 0;

    function onClick(e) {
      const now = Date.now();
      if (now - lastAt < 100) return;
      lastAt = now;

      const el = e.target instanceof Element ? e.target : null;
      const doc = document.documentElement;
      const pageW = doc.scrollWidth;
      const pageH = doc.scrollHeight;
      const x = Math.round(e.pageX);
      const y = Math.round(e.pageY);

      let target = null;
      if (el) {
        const tag = el.tagName ? el.tagName.toLowerCase() : "";
        const id = el.id || "";
        const cls =
          typeof el.className === "string" ? el.className.slice(0, 200) : "";
        const text = (el.innerText || el.textContent || "").trim().slice(0, 120);
        const href = el.closest?.("a")?.getAttribute("href") || null;
        target = { tag, id, cls, text, href };
      }

      send({
        type: "click",
        path: window.location.pathname,
        x,
        y,
        pageW,
        pageH,
        target,
        ...envelope(),
      });
    }

    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
