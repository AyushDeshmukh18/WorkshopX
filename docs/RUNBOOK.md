# FirstBuild Engine - Operational Runbook & Incident Response

This document provides step-by-step procedures for handling critical operational failures and system drills during the campaign.

---

## Drill 1: Primary AI (Google Gemini) Outage or Rate Limit (HTTP 429)

### Symptoms
- Gemini API returns HTTP 429 (Resource Exhausted) or HTTP 503.
- Error logs indicate `[AI Provider] Gemini request failed`.

### Automatic Engine Behavior
1. The engine catches the Gemini exception.
2. It immediately retries once if timeout occurred.
3. If still failing, it transfers the request to **Tier 2: Groq Llama 3.3 70B**.
4. If Groq also fails, it transfers to **Tier 3: Static Blueprint Library**.
5. The student receives a valid blueprint without interruption.

### Manual Actions
1. Check Google AI Studio quotas and billing alerts.
2. If Gemini remains degraded, update `app_settings` or set `GROQ_API_KEY` as primary if necessary.

---

## Drill 2: Secondary AI (Groq) Outage

### Symptoms
- Groq returns HTTP 429 or 5xx while Gemini is also experiencing degradation.

### Automatic Engine Behavior
1. Fallback chain activates `getStaticBlueprint(branch, interest, skill_level)`.
2. High-quality matching blueprint returned in < 2ms.
3. Database `blueprints.source` is recorded as `'static'`.
4. Zero 500 errors returned to users.

---

## Drill 3: Daily Email Quota Exhausted

### Symptoms
- Brevo 300/day limit reached; Brevo returns HTTP 400 (`quota_exceeded`).

### Automatic Engine Behavior
1. The engine detects that `sent_count_today >= EMAIL_DAILY_LIMIT`.
2. Outbox notifications remain in `status = 'pending'`.
3. Notifications are **never** marked failed due to quota exhaustion.
4. An alert is sent to Telegram: `[Alert] Daily email quota threshold reached. Deferring remaining non-urgent dispatches.`
5. Crucial transactional OTP emails can switch to `EMAIL_PROVIDER=resend` or `smtp`.

### Manual Actions
1. In Vercel environment variables, change `EMAIL_PROVIDER=resend` (or `smtp`).
2. Trigger an immediate manual tick from Admin Dashboard -> Notifications -> "Process Queue".

---

## Drill 4: Supabase Free Tier Inactivity Pause

### Symptoms
- Supabase project reports paused or connection refused.

### Prevention Mechanism
- The 5-minute GitHub Actions cron `/api/cron/tick` executes a lightweight query (`SELECT 1 FROM app_settings`) every 300 seconds, maintaining continuous active status.

### Recovery If Paused
1. Log into [supabase.com](https://supabase.com) and click **Restore Project** (takes ~60 seconds).
2. Once active, the outbox automatically resumes claiming pending notifications on the next tick.

---

## Drill 5: Missed Cron Ticks (GitHub Actions Delay)

### Symptoms
- GitHub Actions experiences workflow scheduling delays.

### Mitigation
1. **Redundant Trigger:** cron-job.org or external uptime monitors execute `POST /api/cron/tick` every 5 minutes in parallel.
2. **Batch Catch-Up:** When the next tick fires, `claim_notifications` claims all notifications where `run_at <= now()`.
3. **Idempotency:** Because rows are claimed with `FOR UPDATE SKIP LOCKED` and deduplicated by `UNIQUE(registration_id, kind)`, duplicate ticks execute concurrently without double-sending emails.

---

## Drill 6: Workshop Date or Time Changed in Admin

### Symptoms
- Workshop schedule shifted due to college exams or speaker availability.

### Engine Response & Workflow
1. Admin updates `workshop_starts_at` in `/admin/settings`.
2. Database update triggers an automated reschedule of all pending reminder notifications (`reminder_24h`, `reminder_2h`, `reminder_15m`) whose `status = 'pending'`.
3. Passed or already sent reminders are left untouched.
4. Next cron tick uses the recalculated `run_at` timestamps seamlessly.
