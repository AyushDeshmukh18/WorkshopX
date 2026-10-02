# 3-Minute Video Demo Script

A structured 180-second walkthrough demonstrating the core value proposition, growth mechanics, live engine, and production resilience of **FirstBuild Engine**.

---

## Part 1: The Core Insight (0:00 - 0:30)
- **Visual:** Split screen showing typical college webinar registration drop-offs vs. the FirstBuild Engine experience on a mobile viewport.
- **Narration:**
  > "Free tech webinars regularly suffer 70% no-show rates because students register passively for generic topics and forget. For final-year engineering students facing placements in Tier-2 and Tier-3 colleges, generic resumes don't cut it. FirstBuild Engine flips this dynamic by giving every student a tailored, placement-ready AI project blueprint before they even register. We turn passive sign-ups into active, committed attendees with zero software budget."

---

## Part 2: The Campaign Plan & Math (0:30 - 1:00)
- **Visual:** Display Admin Funnel Simulator and Channel Strategy diagram.
- **Narration:**
  > "To reach 500 registrations without paid ads, we rely on a zero-cost flywheel: 40 Campus Captains across engineering colleges, backed by a student referral engine with a 0.35 K-factor. Attendance is driven by a pre-workshop commitment, precision T-24h, T-2h, and T-15m outbox reminders, and instant project evaluation during the live room. Our simulator predicts 210+ live attendees strictly on free-tier infrastructure."

---

## Part 3: Live System Demonstration (1:00 - 2:30)

### 1. Student Landing & AI Blueprint (1:00 - 1:25)
- **Action:** Visit `/` on mobile viewport. Select "CSE" -> "AI" -> "Beginner".
- **Action:** Teaser reveals project match score (94%) and project name: *Campus Placement Resume Screener*.
- **Action:** Enter email, verify with 6-digit OTP. Full blueprint unlocks with stack, 60-min build steps, and resume bullet point.

### 2. Viral Sharing & College Leaderboard (1:25 - 1:45)
- **Action:** Navigate to student dashboard `/dashboard/me`. Show referral code and dynamic OG card for WhatsApp Status and LinkedIn.
- **Action:** Open `/leaderboard`. Show live updates of college registration rankings streaming via Supabase Realtime without PII.

### 3. Live Room & Submission Evaluator (1:45 - 2:10)
- **Action:** Open `/live?t=<join_token>`. Attendance marks automatically. Show live poll and student Q&A upvotes.
- **Action:** Switch to `/submit`. Submit a sample GitHub repository and live deployment URL.
- **Action:** Show automated evaluation: PageSpeed check, GitHub dependency audit for AI SDKs, and Gemini rubric score.

### 4. Verifiable Certificate & Admin Dashboard (2:10 - 2:30)
- **Action:** Download verifiable PDF certificate with QR code resolving to public verification page `/verify/[id]`.
- **Action:** Open `/admin` command center. Toggle "Include synthetic data" to show strict data segregation; view pace vs. 500, outbox status, and AI analyst digest.

---

## Part 4: Retrospective & Next 24 Hours (2:30 - 3:00)
- **Visual:** Architecture diagram and AI Decision Log.
- **Narration:**
  > "What changed from initial concepts: we eliminated paid WhatsApp APIs in favor of zero-cost captain forwarding kits, replaced fragile n8n webhooks with an idempotent transactional outbox, and added a 3-tier fallback engine ensuring zero 500 errors. With 24 more hours, we would activate the mentor FAQ bot using pgvector embeddings and add automated code diff hints during live evaluations."
