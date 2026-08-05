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
    const attempts = [];

    // 1) Try raw JSON parse (handles a normal paste of the file contents).
    const trimmed = raw.trim();
    try {
      json = JSON.parse(trimmed);
    } catch (e) {
      attempts.push("raw:" + e.message);
    }

    // 2) Try base64 decode → JSON parse (safe path, avoids quote/newline mangling).
    if (!json) {
      try {
        const decoded = Buffer.from(trimmed, "base64").toString("utf8");
        json = JSON.parse(decoded);
      } catch (e) {
        attempts.push("base64:" + e.message);
      }
    }

    // 3) Try repairing common paste damage: smart quotes → straight quotes,
    //    stray CR characters, etc.
    if (!json) {
      const repaired = trimmed
        .replace(/[“”]/g, '"')
        .replace(/[‘’]/g, "'")
        .replace(/\r/g, "");
      try {
        json = JSON.parse(repaired);
      } catch (e) {
        attempts.push("repaired:" + e.message);
      }
    }

    if (!json) {
      throw new Error(
        "FIREBASE_SERVICE_ACCOUNT could not be parsed. Tried raw JSON, base64, and quote-repair. " +
          "Attempts: " +
          attempts.join(" | ") +
          ". First 60 chars of value: " +
          JSON.stringify(trimmed.slice(0, 60))
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
