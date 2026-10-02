# API Route Specifications & Contracts

This document specifies all REST endpoints, authentication rules, input validations, response structures, and error codes for **FirstBuild Engine**.

---

## 1. Authentication & Security Paradigms

- **Public Endpoints:** Open to all clients; rate-limited by IP hash (`ip_hash`).
- **Student Authenticated:** Requires signed HTTP-only JWT session cookie (`session_token`) issued via OTP verification.
- **Admin Authenticated:** Requires session cookie where `email` matches the `ADMIN_EMAILS` allowlist.
- **Cron / Internal Endpoints:** Requires header `Authorization: Bearer <CRON_SECRET>`.
- **Telegram Webhook:** Requires header `X-Telegram-Bot-Api-Secret-Token: <TELEGRAM_WEBHOOK_SECRET>`.

---

## 2. Public & Student Endpoints

### `POST /api/blueprints`
Generates a customized 60-minute project blueprint based on student academic profile.
- **Auth:** Public (Rate limit: 5 requests/hour per `ip_hash`).
- **Input (JSON):**
  ```json
  {
    "branch": "CSE",
    "interest": "AI",
    "skill_level": "beginner"
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "project_name": "Campus Placement Resume Screener",
    "one_liner": "An AI parser that checks student resumes against job descriptions.",
    "match_score": 94,
    "teaser_only": true
  }
  ```
- **Errors:**
  - `400 Bad Request`: Invalid branch/interest/level choices.
  - `429 Too Many Requests`: Rate limit exceeded.

---

### `POST /api/register/start`
Initiates student registration and dispatches a 6-digit email OTP.
- **Auth:** Public (Rate limit: 3/10min per email, 10/hour per `ip_hash`).
- **Input (JSON):**
  ```json
  {
    "email": "student@college.edu",
    "full_name": "Arjun Sharma",
    "college_name": "JNTU Hyderabad",
    "branch": "CSE",
    "grad_year": 2025,
    "skill_level": "beginner",
    "interest": "AI",
    "language": "en",
    "referral_code": "optional_ref_code",
    "consent": true,
    "consent_marketing": true
  }
  ```
- **Output (200 OK):**
  ```json
  {
    "success": true,
    "message": "OTP verification code sent to your email."
  }
  ```
- **Errors:**
  - `400 Bad Request`: Validation failure or disposable email domain.
  - `409 Conflict`: `CAP_REACHED` (Workshop full) or `REGISTRATION_CLOSED`.
  - `429 Too Many Requests`: Exceeded rate limit.

---

### `POST /api/register/verify`
Validates the email OTP, confirms seat reservation, creates referral link, and sets session cookie.
- **Auth:** Public.
- **Input (JSON):**
  ```json
  {
    "email": "student@college.edu",
    "otp": "481920"
  }
  ```
- **Output (200 OK, sets `session_token` cookie):**
  ```json
  {
    "success": true,
    "seat_number": 42,
    "referral_code": "FB9X2A1P",
    "share_url": "https://workshop.domain.com/r/FB9X2A1P",
    "blueprint": {
      "project_name": "Campus Placement Resume Screener",
      "one_liner": "...",
      "what_youll_build_in_60_min": "...",
      "stack": ["Next.js", "Gemini API", "Tailwind CSS"],
      "resume_bullet": "Built automated ATS resume analyzer...",
      "first_3_steps": ["Step 1...", "Step 2...", "Step 3..."]
    }
  }
  ```
- **Errors:**
  - `400 Bad Request`: Invalid or expired OTP (exceeded 5 attempts or past 10 min TTL).

---

### `DELETE /api/me`
Permanently deletes or anonymizes student personal data pursuant to DPDP Act 2023.
- **Auth:** Student Authenticated (`session_token`).
- **Output (200 OK, clears cookies):**
  ```json
  {
    "success": true,
    "message": "Your personal data has been erased."
  }
  ```

---

## 3. Workshop Live & Evaluation Endpoints

### `POST /api/submissions`
Queues a completed workshop project repository and live deployment for scoring.
- **Auth:** Student Authenticated (must have attended).
- **Input (JSON):**
  ```json
  {
    "repo_url": "https://github.com/student/my-ai-project",
    "live_url": "https://my-ai-project.vercel.app"
  }
  ```
- **Output (201 Created):**
  ```json
  {
    "submission_id": "sub_981249",
    "status": "queued"
  }
  ```

---

### `GET /api/certificate/[id].pdf`
Generates and streams a tamper-proof PDF certificate.
- **Auth:** Public.
- **Output (200 OK):** Binary PDF stream (`Content-Type: application/pdf`).

---

## 4. Background & Cron Endpoints

### `POST /api/cron/tick`
Heartbeat scheduler executed every 5 minutes.
- **Auth:** `Authorization: Bearer <CRON_SECRET>`
- **Output (200 OK):**
  ```json
  {
    "claimed": 8,
    "sent": 8,
    "failed": 0,
    "reminders_enqueued": 14,
    "duration_ms": 3210
  }
  ```

---

### `POST /api/cron/digest`
Computes daily performance metrics and posts the PII-free summary to Telegram.
- **Auth:** `Authorization: Bearer <CRON_SECRET>` or Admin Session.
- **Output (200 OK):**
  ```json
  {
    "registered": 340,
    "verified": 312,
    "pace_vs_500": "+12%",
    "telegram_delivered": true
  }
  ```
