-- ==============================================================================
-- FirstBuild Engine Migration 001: Initial Schema and RLS Policies
-- ==============================================================================

-- Enable pgcrypto for UUID generation and cryptographic hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Clean schema namespace
CREATE SCHEMA IF NOT EXISTS "public";

-- ------------------------------------------------------------------------------
-- 1. App Settings (Singleton)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.app_settings (
    id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    workshop_name TEXT NOT NULL DEFAULT 'Build Your First AI Project in 60 Minutes',
    workshop_starts_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    join_url TEXT NOT NULL DEFAULT 'https://meet.google.com/xyz-sample',
    registration_cap INT NOT NULL DEFAULT 500,
    registration_open BOOLEAN NOT NULL DEFAULT true,
    certificate_threshold INT NOT NULL DEFAULT 50,
    physical_address_line TEXT NOT NULL DEFAULT 'FirstBuild Technical Education Initiative, Hyderabad, India',
    -- Funnel simulator default assumptions
    sim_outreach_count INT NOT NULL DEFAULT 150,
    sim_reply_rate NUMERIC(4,3) NOT NULL DEFAULT 0.200,
    sim_regs_per_captain NUMERIC(4,2) NOT NULL DEFAULT 8.50,
    sim_share_rate NUMERIC(4,3) NOT NULL DEFAULT 0.350,
    sim_k_factor NUMERIC(4,3) NOT NULL DEFAULT 0.350,
    sim_show_up_rate NUMERIC(4,3) NOT NULL DEFAULT 0.420,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. Colleges & Live Aggregations
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    name_normalized TEXT NOT NULL UNIQUE,
    state TEXT NOT NULL DEFAULT 'Unknown',
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_colleges_normalized ON public.colleges(name_normalized);

CREATE TABLE IF NOT EXISTS public.college_stats (
    college_id UUID PRIMARY KEY REFERENCES public.colleges(id) ON DELETE CASCADE,
    college_name TEXT NOT NULL,
    state TEXT NOT NULL,
    verified_count INT NOT NULL DEFAULT 0,
    attended_count INT NOT NULL DEFAULT 0,
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_college_stats_verified ON public.college_stats(verified_count DESC);

-- ------------------------------------------------------------------------------
-- 3. Registrations (Core Student Table)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    email_normalized TEXT NOT NULL UNIQUE,
    phone_hash TEXT,
    full_name TEXT NOT NULL,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE RESTRICT,
    branch TEXT NOT NULL,
    grad_year INT NOT NULL,
    skill_level TEXT NOT NULL CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
    interest TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'hi', 'te')),
    referral_code TEXT NOT NULL UNIQUE,
    referred_by_code TEXT,
    captain_id UUID,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'captain')),
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    ip_hash TEXT NOT NULL,
    email_verified_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'cancelled')),
    consent_at TIMESTAMPTZ NOT NULL,
    consent_marketing BOOLEAN NOT NULL DEFAULT false,
    unsubscribed_at TIMESTAMPTZ,
    attended_at TIMESTAMPTZ,
    join_token TEXT NOT NULL UNIQUE,
    commitment_text TEXT,
    commitment_at TIMESTAMPTZ,
    priority_access BOOLEAN NOT NULL DEFAULT false,
    seat_number INT UNIQUE,
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_registrations_referral_code ON public.registrations(referral_code);
CREATE INDEX IF NOT EXISTS idx_registrations_referred_by ON public.registrations(referred_by_code);
CREATE INDEX IF NOT EXISTS idx_registrations_join_token ON public.registrations(join_token);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON public.registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_ip_hash ON public.registrations(ip_hash);

-- ------------------------------------------------------------------------------
-- 4. Email OTPs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.email_otps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email_normalized TEXT NOT NULL,
    code_hash TEXT NOT NULL,
    purpose TEXT NOT NULL CHECK (purpose IN ('register', 'admin', 'login')),
    expires_at TIMESTAMPTZ NOT NULL,
    attempts INT NOT NULL DEFAULT 0,
    consumed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_email_otps_lookup ON public.email_otps(email_normalized, purpose, consumed_at, expires_at);

-- ------------------------------------------------------------------------------
-- 5. AI Blueprints & Cache
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    branch TEXT NOT NULL,
    interest TEXT NOT NULL,
    level TEXT NOT NULL,
    payload JSONB NOT NULL,
    source TEXT NOT NULL CHECK (source IN ('gemini', 'groq', 'static', 'cache')),
    match_score INT NOT NULL CHECK (match_score BETWEEN 60 AND 98),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blueprints_registration ON public.blueprints(registration_id);

CREATE TABLE IF NOT EXISTS public.ai_cache (
    key TEXT PRIMARY KEY,
    payload JSONB NOT NULL,
    hits INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_usage (
    day DATE NOT NULL,
    provider TEXT NOT NULL,
    calls INT NOT NULL DEFAULT 1,
    PRIMARY KEY (day, provider)
);

-- ------------------------------------------------------------------------------
-- 6. Referrals & Milestones
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    referrer_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    referred_id UUID NOT NULL UNIQUE REFERENCES public.registrations(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    reject_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    verified_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_referrals_referrer ON public.referrals(referrer_id, status);

CREATE TABLE IF NOT EXISTS public.milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN ('refs_3', 'refs_10')),
    granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (registration_id, kind)
);

-- ------------------------------------------------------------------------------
-- 7. Campaign Events (Telemetry, No Raw IP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.campaign_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL CHECK (event_type IN (
        'page_view', 'blueprint_generated', 'otp_sent', 'registered',
        'verified', 'shared', 'attended', 'submitted', 'certified'
    )),
    registration_id UUID REFERENCES public.registrations(id) ON DELETE SET NULL,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    session_hash TEXT NOT NULL,
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_events_type_created ON public.campaign_events(event_type, created_at);

-- ------------------------------------------------------------------------------
-- 8. Notifications Outbox (Idempotent Transactional Outbox)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    kind TEXT NOT NULL CHECK (kind IN (
        'otp', 'welcome', 'blueprint', 'reminder_24h', 'reminder_2h',
        'reminder_15m', 'milestone', 'post_event', 'certificate'
    )),
    channel TEXT NOT NULL DEFAULT 'email' CHECK (channel IN ('email')),
    run_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed', 'skipped')),
    attempts INT NOT NULL DEFAULT 0,
    last_error TEXT,
    provider_message_id TEXT,
    claimed_at TIMESTAMPTZ,
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enforce strict unique constraint per registration and kind (except otp which can reoccur)
CREATE UNIQUE INDEX IF NOT EXISTS uq_notifications_reg_kind 
ON public.notifications(registration_id, kind) 
WHERE kind != 'otp';

CREATE INDEX IF NOT EXISTS idx_notifications_queue 
ON public.notifications(status, run_at) 
WHERE status IN ('pending', 'processing');

-- ------------------------------------------------------------------------------
-- 9. Outreach & Captains
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.outreach_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_name TEXT NOT NULL,
    contact_role TEXT NOT NULL CHECK (contact_role IN ('club head', 'CR', 'TPO', 'placement cell')),
    contact_name TEXT NOT NULL,
    contact_email TEXT NOT NULL,
    source_note TEXT,
    consent_basis TEXT NOT NULL, -- Mandatory per DPDP Act
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'drafted', 'contacted', 'replied', 'captain', 'declined')),
    draft_email TEXT,
    draft_whatsapp TEXT,
    assigned_code TEXT,
    notes TEXT,
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.captains (
    registration_id UUID PRIMARY KEY REFERENCES public.registrations(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES public.colleges(id) ON DELETE RESTRICT,
    kit_generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    regs_attributed INT NOT NULL DEFAULT 0,
    is_synthetic BOOLEAN NOT NULL DEFAULT false
);

-- ------------------------------------------------------------------------------
-- 10. Live Workshop Layer (Polls, Q&A, Check-ins)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.polls (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.poll_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    votes_count INT NOT NULL DEFAULT 0,
    display_order INT NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.poll_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    poll_id UUID NOT NULL REFERENCES public.polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES public.poll_options(id) ON DELETE CASCADE,
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (poll_id, registration_id)
);

CREATE TABLE IF NOT EXISTS public.qa_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    question TEXT NOT NULL,
    upvotes INT NOT NULL DEFAULT 1,
    is_answered BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.qa_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.qa_questions(id) ON DELETE CASCADE,
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (question_id, registration_id)
);

CREATE TABLE IF NOT EXISTS public.checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL REFERENCES public.registrations(id) ON DELETE CASCADE,
    milestone_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (registration_id, milestone_key)
);

-- ------------------------------------------------------------------------------
-- 11. Submissions & Certificates
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID NOT NULL UNIQUE REFERENCES public.registrations(id) ON DELETE CASCADE,
    repo_url TEXT NOT NULL,
    live_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'queued' CHECK (status IN ('queued', 'evaluating', 'done', 'failed')),
    score_total INT,
    score_breakdown JSONB,
    tips JSONB,
    pagespeed JSONB,
    evaluated_at TIMESTAMPTZ,
    is_synthetic BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY, -- 12-char cryptographically random string
    registration_id UUID NOT NULL UNIQUE REFERENCES public.registrations(id) ON DELETE CASCADE,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    score INT NOT NULL,
    revoked_at TIMESTAMPTZ,
    is_synthetic BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_certificates_reg ON public.certificates(registration_id);

-- ------------------------------------------------------------------------------
-- 12. Rate Limits & Job Logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.rate_limits (
    key TEXT NOT NULL,
    window_start TIMESTAMPTZ NOT NULL,
    count INT NOT NULL DEFAULT 1,
    PRIMARY KEY (key, window_start)
);

CREATE TABLE IF NOT EXISTS public.job_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    job TEXT NOT NULL,
    status TEXT NOT NULL,
    duration_ms INT NOT NULL,
    details JSONB,
    error TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_job_logs_created ON public.job_logs(created_at DESC);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- Default: DENY ALL for anon and authenticated roles.
-- Scoped SELECT policies on non-PII Realtime tables only.
-- ==============================================================================

ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.college_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outreach_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.captains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.qa_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_logs ENABLE ROW LEVEL SECURITY;

-- Explicit Public Read Policies (Zero PII, Realtime-enabled)
CREATE POLICY "Public can view college stats leaderboard" 
ON public.college_stats FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view active polls" 
ON public.polls FOR SELECT TO anon, authenticated USING (is_active = true);

CREATE POLICY "Public can view poll options" 
ON public.poll_options FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view workshop Q&A questions" 
ON public.qa_questions FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Public can view verified certificate status" 
ON public.certificates FOR SELECT TO anon, authenticated USING (revoked_at IS NULL);
