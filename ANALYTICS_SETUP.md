# FastGas self-hosted analytics — setup

## 1. Install deps
```
npm install
```

## 2. Create Firebase project + Firestore
1. Go to https://console.firebase.google.com → **Add project** → "fastgas-analytics".
2. In the left nav → **Build → Firestore Database** → **Create database** →
   Production mode → pick region `europe-west1` (or nearest).
3. In the left nav → **Project settings** (gear icon) → **Service accounts** tab
   → **Generate new private key**. Downloads a JSON file. Keep it safe.

## 3. Env vars
Add to `.env.local` (dev) and to Vercel Project Settings → Environment Variables
(prod). Values come from the service-account JSON.

**Preferred — one env var, whole JSON:**
```
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"fastgas-ffd66","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...","client_email":"firebase-adminsdk-xxx@fastgas-ffd66.iam.gserviceaccount.com","client_id":"...","auth_uri":"...","token_uri":"...","auth_provider_x509_cert_url":"...","client_x509_cert_url":"..."}
```
Paste the ENTIRE contents of the downloaded service-account JSON as the value.
If your host mangles multi-line pastes, base64-encode it first
(`base64 -i service-account.json` on macOS) and paste the base64 string — the
code auto-detects both formats.

**Fallback — three separate vars (only if you prefer):**
```
FIREBASE_PROJECT_ID=fastgas-ffd66
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@fastgas-ffd66.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEv...\n-----END PRIVATE KEY-----\n"
```

**Always set these:**
```
IP_SALT=some-random-string-here
ADMIN_PASSWORD=pick-a-strong-password

# Optional — enables ISP/ASN/VPN lookups. Free tier at https://ipinfo.io (50k/mo)
IPINFO_TOKEN=

# Optional — for Vercel Cron to call /api/admin/cleanup without a login cookie
CRON_SECRET=another-random-string

# Optional — override IP retention window (default 30)
IP_RETENTION_DAYS=30
```

Notes:
- Wrap `FIREBASE_PRIVATE_KEY` in double quotes and keep the `\n` literals — the
  code converts them back to real newlines.
- `IP_SALT` is only used to hash IPs so raw IPs aren't stored.
- `ADMIN_PASSWORD` is what you'll type at `/admin/login`.

## 4. Firestore rules (optional but recommended)
The Admin SDK bypasses rules, but if you ever add client Firestore access,
lock the collection to server-only writes:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /analytics_events/{doc} {
      allow read, write: if false;
    }
  }
}
```

## 5. Run
```
npm run dev
```
Visit the site once to generate events, then open `/admin/analytics` →
password-gated by `ADMIN_PASSWORD`.

## 6. Deploy
Push to Vercel as usual. Env vars must be set in the Vercel dashboard.
Country/city columns light up automatically on Vercel (uses
`x-vercel-ip-country` header). If you put Cloudflare in front later, the code
also reads `cf-ipcountry`.

## Firestore indexes
Firestore needs a composite index for the session drill-down query. On first
call the console prints a direct "create this index" link — click it and
approve. If you want to create it manually: collection `analytics_events`,
fields `sessionId ASC, createdAt ASC`.

## Vercel Cron (optional but recommended for IP purge)
`vercel.json` is already committed with a daily cron at 03:00 UTC. In Vercel
dashboard → Project → Settings → Cron Jobs it should appear after your next
deploy. If you set `CRON_SECRET`, add a header in the cron job:
`x-cron-secret: <same value>`. Vercel Cron sends `Authorization: Bearer
<CRON_SECRET>` automatically for authenticated crons — the route accepts both.

## What you get
- **Pageviews / clicks / sessions / unique visitors** totals for a chosen window.
- **Top pages**, **countries**, **devices**, **browsers**, **OS** breakdowns.
- **Traffic-per-hour** bar chart.
- **Most-clicked elements** (by tag + text).
- **Rage-click flags** — sessions with 3+ clicks in <1s in the same ~40px area.
- **Click heatmap** — enter a path (e.g. `/`) and see the click density
  rendered on a canvas.
- **Recent sessions table** — last 100 sessions with IP, country, city, ISP,
  VPN flag, device, browser, entry page. Click "View" to drill down.
- **Per-session drill-down** — full visitor profile (IP, ISP/ASN, geo,
  device, browser, OS, screen, language, timezone, connection type, landing
  URL + UTMs) plus the full click-by-click event stream.
- **30-day raw-IP retention** — a scheduled cleanup job nulls out raw IPs
  older than the retention window; hashed IP + geo stay for aggregates.

## Cost
Firestore free tier: 50k reads / 20k writes / 1 GiB storage per day. Every
pageview and click is 1 write. Every dashboard load is one read per event in
the window. At small/medium traffic you'll stay in the free tier; if you cross
it, either add sampling (in `Tracker.jsx`) or pre-aggregate hourly rollups.

## Turning it off
Remove `<Tracker />` from `app/layout.jsx` — the API routes will simply stop
receiving events.
