# FirstBuild Engine - Setup & Operations Manual

This guide walks through configuring third-party accounts, credentials, database migrations, and operational schedules for **FirstBuild Engine**.

---

## 1. Local Environment Setup

1. **Clone & Install Dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Environment Variables:**
   ```bash
   cp .env.example .env.local
   ```
   Open `.env.local` and populate the required configuration values described below.

3. **Verify Local Build & Test Suite:**
   ```bash
   npm run typecheck
   npm run lint
   npm run test
   npm run build
   ```

---

## 2. Supabase Setup (Database & Realtime)

1. Create a free project at [supabase.com](https://supabase.com).
2. Go to **Project Settings -> API**:
   - Copy the **Project URL** into `NEXT_PUBLIC_SUPABASE_URL`.
   - Copy the **anon public** key into `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - Copy the **service_role secret** key into `SUPABASE_SECRET_KEY` (Keep this server-only; never share it).
3. Apply database migrations:
   - Navigate to **SQL Editor** in the Supabase dashboard.
   - Run `supabase/migrations/20261002000001_initial_schema.sql`.
   - Run `supabase/migrations/20261002000002_functions_and_triggers.sql`.
   - Run `supabase/seed.sql` to initialize default workshop settings and college records.

---

## 3. AI Providers Setup

### Google Gemini (Primary)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Create an API Key and assign it to `GEMINI_API_KEY`.
3. Set `GEMINI_MODEL=gemini-1.5-flash`.

### Groq (Fallback)
1. Visit [Groq Console](https://console.groq.com/).
2. Generate an API Key and assign it to `GROQ_API_KEY`.
3. Set `GROQ_MODEL=llama-3.3-70b-versatile`.

---

## 4. Email Provider Setup

Choose your preferred provider by setting `EMAIL_PROVIDER=brevo` (recommended), `resend`, or `smtp`.

### Brevo (Primary Free Tier: 300/day)
1. Sign up at [brevo.com](https://www.brevo.com/).
2. Navigate to **Account Settings -> Senders & IP -> Senders**:
   - Add your sender email (e.g., `workshop@yourdomain.com`).
   - Complete verification via the confirmation email.
3. Navigate to **SMTP & API -> API Keys**:
   - Generate an API key and assign it to `BREVO_API_KEY`.
   - Set `EMAIL_FROM_ADDRESS=workshop@yourdomain.com`.
   - Set `EMAIL_DAILY_LIMIT=250`.

### Resend (Secondary Free Tier: 100/day)
1. Sign up at [resend.com](https://resend.com/).
2. Navigate to **Domains** and verify your custom DNS records.
3. Generate an API key and assign it to `RESEND_API_KEY`.

### Gmail SMTP (Fallback Free Tier: 500/day)
1. In your Google Account, enable **2-Step Verification**.
2. Go to **Security -> App Passwords** and generate a password for "Mail".
3. Configure in `.env.local`:
   ```env
   EMAIL_PROVIDER=smtp
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=xxxx-xxxx-xxxx-xxxx
   EMAIL_FROM_ADDRESS=your-email@gmail.com
   ```

---

## 5. Telegram Admin Bot & Alerts

1. Open Telegram and message [@BotFather](https://t.me/BotFather).
2. Create a new bot with `/newbot`, choose a name, and copy the HTTP API token into `TELEGRAM_BOT_TOKEN`.
3. Retrieve your personal Telegram Chat ID:
   - Message [@userinfobot](https://t.me/userinfobot) to get your numerical user ID.
   - Set `TELEGRAM_ADMIN_CHAT_ID=<your_user_id>`.
4. Generate a random webhook secret (32+ chars) and set `TELEGRAM_WEBHOOK_SECRET=your-random-token`.
5. Register the webhook after deploying to production:
   ```bash
   npx ts-node scripts/set-telegram-webhook.ts
   ```

---

## 6. External Verification Keys

1. **Google PageSpeed Insights API:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/).
   - Enable "PageSpeed Insights API".
   - Create an API Key and set `PAGESPEED_API_KEY`.
2. **GitHub Personal Access Token (Optional):**
   - Create a fine-grained or classic token with public repository read permissions at [github.com/settings/tokens](https://github.com/settings/tokens).
   - Set `GITHUB_TOKEN`.

---

## 7. Security & Session Secrets

Generate cryptographically strong keys using Node:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
- Copy the first output into `SESSION_SECRET`.
- Copy the second output into `CRON_SECRET`.
- Copy the third output into `IP_HASH_SALT`.
- Configure `ADMIN_EMAILS=your.email@example.com` (comma-separated allowlist).

---

## 8. Scheduler Automation Configuration

### GitHub Actions (Primary 5-Minute Scheduler)
1. In your GitHub repository, navigate to **Settings -> Secrets and variables -> Actions**.
2. Add the following repository secrets:
   - `APP_URL`: Your production URL (e.g. `https://workshop.yourdomain.com`).
   - `CRON_SECRET`: Must match the `CRON_SECRET` configured in `.env.local` / Vercel.
3. The workflow file `.github/workflows/scheduler.yml` executes `POST /api/cron/tick` every 5 minutes.

### Redundant External Cron (cron-job.org)
1. Create a free account at [cron-job.org](https://cron-job.org/).
2. Create a new Cronjob:
   - **URL:** `https://workshop.yourdomain.com/api/cron/tick`
   - **Method:** `POST`
   - **Schedule:** Every 5 minutes
   - **Headers:** `Authorization: Bearer <CRON_SECRET>`
3. Save and enable the job. Because the tick handler is strictly idempotent, concurrent triggers will safely skip locked jobs without duplicate notifications.

---

## 9. Vercel Deployment & Custom Domain

1. Push your repository to GitHub.
2. Import the repository into [Vercel](https://vercel.com).
3. In **Project Settings -> Environment Variables**, add all keys from `.env.local`.
4. Go to **Settings -> Domains**:
   - Add your custom domain (e.g. `workshop.yourdomain.com`).
   - Add the required CNAME or A records to your DNS registrar (Cloudflare, Namecheap, GoDaddy).
   - Wait for SSL certificate issuance (automatic via Let's Encrypt).
5. Update `NEXT_PUBLIC_APP_URL` in Vercel to `https://workshop.yourdomain.com`.
