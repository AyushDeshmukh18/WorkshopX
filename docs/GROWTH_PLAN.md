# Growth Plan, Funnel Math & Campaign Model

This document outlines the acquisition math, referral loops, conversion benchmarks, and campaign mechanics designed to secure **500 verified registrations and 200+ live attendees** on a ₹0 software budget.

---

## 1. Funnel Unit Economics & Targets

| Funnel Stage | Target Metric | Conversion Rate | Cumulative Volume |
| :--- | :--- | :--- | :--- |
| **Top of Funnel (Impressions & Visits)** | Landing Page Views | 100% | 2,500 |
| **Engagement** | Blueprint Generated | 40% of visitors | 1,000 |
| **Acquisition** | Registration Initiated (OTP Sent) | 65% of blueprints | 650 |
| **Verification** | Verified Registration (Seat Assigned) | 80% of OTPs | **520** (Cap: 500) |
| **Commitment** | Pre-Workshop Project Selection | 55% of verified | 286 |
| **Activation** | Live Workshop Check-in (`attended_at`) | 42% of verified | **218** |
| **Completion** | Project Submission & Evaluation | 60% of attendees | 130 |
| **Advocacy** | Certified & Shared to LinkedIn | 80% of submissions | 104 |

---

## 2. Channel Distribution Strategy

```
                                    +-----------------------+
                                    |  Target: 500 Verified |
                                    +-----------+-----------+
                                                |
                 +------------------------------+-------------------------------+
                 |                                                              |
    +------------v------------+                                   +-------------v-------------+
    |  Campus Captain Network |                                   | Direct Referral Loop      |
    |  - 40 Captains recruited|                                   | - K-factor = 0.35         |
    |  - Avg 8.5 regs/captain |                                   | - Verified Milestone Unlock|
    |  Yield: ~340 regs (65%) |                                   | Yield: ~110 regs (21%)    |
    +-------------------------+                                   +---------------------------+
                 |                                                              |
                 +------------------------------+-------------------------------+
                                                |
                                  +-------------v-------------+
                                  | Organic & Club Outreach   |
                                  | - TPO circulars, tech clubs|
                                  | Yield: ~70 regs (14%)     |
                                  +---------------------------+
```

### Channel 1: Campus Captain Network (65% of volume)
- Recruit **40 Campus Captains** across Tier-2/3 engineering colleges (club leads, CRs, student placement coordinators).
- Provide personalized forwarding kits (`/captain/[code]`) with one-click WhatsApp share templates in English, Hindi, and Telugu.
- Gamified Captain Dashboard tracks real-time registrations attributed to each captain.
- Reward: Official Campus Captain Leadership Certificate at 10 verified registrations.

### Channel 2: Peer Referral Loop (21% of volume)
- Every verified student receives an exclusive referral link (`/r/[code]`) and an automated share card for LinkedIn and WhatsApp Status (`/api/og/[code]`).
- Incentives:
  - **3 Referrals:** Unlocks Priority VIP Project Review during the live build session.
  - **10 Referrals:** Earns the Campus Ambassador Certificate.

### Channel 3: Institutional Club Outreach (14% of volume)
- Outreach copilot assists admin in importing verified club and TPO contact rosters with documented `consent_basis`.
- Generates structured, professional draft emails and WhatsApp messages for manual review. No automated spamming.

---

## 3. The Live Attendance Multipliers

Standard free webinar attendance averages 25%–35%. We achieve 40%+ through 4 behavioral interventions:
1. **Personalized Project Ownership:** The student selects and commits to their specific project before the workshop (`commitment_text`).
2. **Micro-Commitment Reminders:** Precision email triggers at T-24h (reminder), T-2h (preparation checklist), and T-15m (direct join link with unique `join_token`).
3. **Live Milestone Check-ins:** Live build milestones rewarded with real-time room progress badges.
4. **Instant Evaluation & Verifiable Certificate:** Students can deploy their code within the 60 minutes and receive an immediate automated score and verifiable PDF credential.

---

## 4. Simulator Formula (Admin Command Center)

The simulation engine models total registrations and attendees dynamically:
$$\text{Captain Regs} = \text{Captains} \times \text{Average Regs per Captain}$$
$$\text{Direct Regs} = \text{Outreach Sent} \times \text{Reply Rate} \times \text{Conversion Rate}$$
$$\text{Base Regs} = \text{Captain Regs} + \text{Direct Regs}$$
$$\text{Total Regs} = \text{Base Regs} \times (1 + K_{\text{factor}})$$
$$\text{Expected Attendees} = \text{Total Regs} \times \text{Show-up Rate}$$
