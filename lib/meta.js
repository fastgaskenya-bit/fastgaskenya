export function trackMetaEvent(eventName, payload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.fbq === "function") {
    window.fbq("track", eventName, payload);
  }
}
