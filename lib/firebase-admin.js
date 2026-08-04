import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Server-only Firebase Admin init.
//
// Preferred: paste the ENTIRE service-account JSON as one env var:
//     FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...", ...}
//
// Fallback: three separate env vars (useful for platforms where a giant JSON
// paste is awkward):
//     FIREBASE_PROJECT_ID
//     FIREBASE_CLIENT_EMAIL
//     FIREBASE_PRIVATE_KEY   (with \n escapes preserved)
let app;

function loadCredentials() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (raw) {
    let json;
    try {
      // Support both plain JSON and base64-encoded JSON (some UIs mangle
      // multi-line pastes; base64 is a safe fallback).
      const trimmed = raw.trim();
      const looksLikeJson = trimmed.startsWith("{");
      json = JSON.parse(
        looksLikeJson
          ? trimmed
          : Buffer.from(trimmed, "base64").toString("utf8")
      );
    } catch (err) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT is set but could not be parsed as JSON: " +
          err.message
      );
    }
    const { project_id, client_email, private_key } = json;
    if (!project_id || !client_email || !private_key) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT JSON is missing project_id / client_email / private_key."
      );
    }
    return {
      projectId: project_id,
      clientEmail: client_email,
      privateKey: private_key.replace(/\\n/g, "\n"),
    };
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      "Missing Firebase credentials. Set FIREBASE_SERVICE_ACCOUNT (JSON) " +
        "or FIREBASE_PROJECT_ID + FIREBASE_CLIENT_EMAIL + FIREBASE_PRIVATE_KEY."
    );
  }
  return { projectId, clientEmail, privateKey };
}

function getApp() {
  if (getApps().length) return getApps()[0];
  const creds = loadCredentials();
  return initializeApp({ credential: cert(creds) });
}

export function getDb() {
  if (!app) app = getApp();
  return getFirestore(app);
}
