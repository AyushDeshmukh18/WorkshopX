# System Assumptions, API Limits & Provider Verification

This document verifies and tracks all third-party API limits, free-tier quotas, operational constraints, and technical assumptions for **FirstBuild Engine**.

---

## 1. Email Service Providers (Free Tier Analysis & Rules)

### Primary: Brevo (formerly Sendinblue)
- **API Endpoint:** `https://api.brevo.com/v3/smtp/email` (Transactional REST API)
- **Authentication:** Header `api-key: <BREVO_API_KEY>`
- **Free Tier Allowance:** **300 emails per day** (resets at midnight UTC).
- **Sender Verification:** Sender email domain or individual address (`EMAIL_FROM_ADDRESS`) must be verified in the Brevo Dashboard. Unverified senders result in HTTP 400 rejection.
- **Safety Margin:** Set `EMAIL_DAILY_LIMIT=250` in `.env.local` to prevent provider hard-cap blocks and preserve emergency transactional OTP capacity.

### Secondary: Resend
- **API Endpoint:** `https://api.resend.com/emails` (or official `resend` SDK)
- **Authentication:** Bearer token `Authorization: Bearer <RESEND_API_KEY>`
- **Free Tier Allowance:** **100 emails per day**, up to 3,000 emails per month.
- **Sender Verification:** Requires a verified custom domain for sending to external student recipients. If using the default test sandbox domain (`onboarding@resend.dev`), emails can only be delivered to the account owner's email.

### Last Resort: Gmail SMTP (Nodemailer)
- **Host / Port:** `smtp.gmail.com:587` (TLS) or `465` (SSL).
- **Authentication:** Gmail address + 16-character Google Account **App Password** (requires 2FA enabled on the Google Account).
- **Daily Quota:** Free consumer Google accounts allow ~500 recipients per rolling 24-hour window. Google Workspace accounts allow up to 2,000/day.

---

## 2. Artificial Intelligence Providers

### Primary: Google Gemini (`@google/generative-ai`)
- **Model:** `gemini-1.5-flash` or `gemini-2.0-flash`
- **Free Quota:** Google AI Studio free tier provides **15 Requests Per Minute (RPM)**, **1,500 Requests Per Day (RPD)**, and 1,000,000 Tokens Per Minute (TPM).
- **Structured Outputs:** Configured with `generationConfig: { responseMimeType: "application/json", responseSchema: ... }` to enforce deterministic, parseable JSON matching Zod schemas.
- **Timeout & Retry:** Request timeout set to 8,000ms with a single retry on timeout or JSON parse error before falling back to Groq.

### Secondary: Groq (`groq-sdk`)
- **Model:** `llama-3.3-70b-versatile` (or `llama-3.1-8b-instant`)
- **Free Quota:** 30 RPM, 14,400 RPD on Groq Cloud free tier.
- **JSON Mode:** Configured with `response_format: { type: "json_object" }` alongside a strict system prompt containing the JSON schema specification.
- **Fallback Trigger:** Invoked automatically when Gemini returns rate-limit (HTTP 429), quota exhaustion, 5xx server errors, or fails JSON parsing.

### Final Fallback: Static Blueprint Library (`lib/ai/static-blueprints.ts`)
- **Coverage:** Deterministic offline lookup table covering at least 40 branch x interest combinations (CSE, IT, ECE, EEE, Mech, Civil x Web, AI, Data, Mobile, Embedded).
- **Reliability:** 100% offline, 0ms latency, zero API dependency. Guarantees that students never encounter an error or 5xx response even during total external network outages.

---

## 3. Database & Realtime (Supabase Free Tier)

- **PostgreSQL Version:** 15+
- **Direct Connection Limit:** 60 direct client connections (or thousands via Supabase Transaction Pooler on port 6543 / Supabase JS client).
- **Free Tier Inactivity Pause:** Inactive free-tier Supabase projects are paused after 7 days of zero database activity.
  - **Mitigation:** The 5-minute `/api/cron/tick` scheduler issues a lightweight query (`SELECT 1 FROM app_settings LIMIT 1`) on every execution, keeping the database active continuously.
- **Row-Level Security (RLS):** Enabled on every table with deny-all default policies for `anon` and `authenticated` roles. Only safe aggregation tables (`college_stats`) and live interactive tables (`polls`, `poll_options`, `poll_votes`, `qa_questions`, `qa_votes`, `checkins`) provide scoped `SELECT` access for Realtime listeners.

---

## 4. Scheduling & Cron Architecture

- **Primary Scheduler:** GitHub Actions workflow (`.github/workflows/scheduler.yml`) configured to run on cron `*/5 * * * *`. Calls `POST /api/cron/tick` with `Authorization: Bearer <CRON_SECRET>`.
- **Redundancy Scheduler:** Free external ping service (cron-job.org or UptimeRobot) configured to call the same endpoint every 5 minutes.
- **Backup Scheduler:** Vercel daily cron specified in `vercel.json` as a safeguard.
- **Idempotency Guarantee:**
  - Database outbox rows are claimed via `SELECT ... FOR UPDATE SKIP LOCKED`.
  - Notifications table enforces `UNIQUE(registration_id, kind)`.
  - Concurrent cron ticks or rapid retries cannot cause duplicate email dispatches.
- **Execution Time Bounding:** The tick handler aborts processing new outbox records when execution time reaches 8,000ms, returning HTTP 200 with batch processing counts to prevent Vercel serverless gateway timeouts.

---

## 5. Security, Privacy & Compliance (DPDP Act 2023)

- **PII Storage:** No raw IP addresses are stored. All IPs are salted and hashed using `SHA-256(ip + IP_HASH_SALT + date)`. Phone numbers (if provided) are hashed using `SHA-256(phone + IP_HASH_SALT)`.
- **Consent Documentation:** Registration requires an active, un-pre-checked consent checkbox storing `consent_at = now()`.
- **Data Subject Rights:** Authenticated students can execute `DELETE /api/me` to erase or anonymize their personal data.
- **Unsubscribe:** Every transactional email (excluding one-time OTP verification codes) contains a token-based, single-click unsubscribe link (`/unsubscribe?token=<signed_token>`).
- **Secret Separation:** All sensitive tokens (Supabase secret key, AI keys, session secret, SMTP credentials) are confined to server-side code using `import 'server-only'`.

---

## 6. Project Evaluation & External APIs

- **GitHub REST API:** Unauthenticated requests are rate-limited to 60 requests/hour per IP. Supplying `GITHUB_TOKEN` increases this to 5,000 requests/hour.
- **Google PageSpeed Insights API:** Free tier quota permits up to 25,000 queries per day.
- **SSRF Safeguards:**
  - Evaluator only queries `https://api.github.com/repos/{owner}/{repo}` after strict regex validation of owner and repository names.
  - Live preview URLs are analyzed exclusively via the Google PageSpeed Insights proxy API (Google fetches the target). The URL must resolve to a valid public hostname using `https://` (IP addresses, localhost, RFC 1918 private subnets, and `.local` domains are strictly rejected).

---

## 7. Timezones & Formatting

- **Database:** All timestamps are generated and stored in UTC (`timestamptz`).
- **User Interface & Notifications:** All student-facing and admin-facing dates are converted to Indian Standard Time (IST, `Asia/Kolkata`, UTC+05:30) for presentation.
