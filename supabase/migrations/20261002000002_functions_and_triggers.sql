-- ==============================================================================
-- FirstBuild Engine Migration 002: Security Definer Stored Functions & Triggers
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Atomic Rate Limiter Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.rate_limit_hit(
    p_key TEXT,
    p_max INT,
    p_window_seconds INT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_window_start TIMESTAMPTZ;
    v_count INT;
BEGIN
    -- Calculate discrete window boundary based on epoch seconds
    v_window_start := TO_TIMESTAMP(FLOOR(EXTRACT(EPOCH FROM NOW()) / p_window_seconds) * p_window_seconds);

    -- Atomic upsert into rate_limits
    INSERT INTO public.rate_limits (key, window_start, count)
    VALUES (p_key, v_window_start, 1)
    ON CONFLICT (key, window_start)
    DO UPDATE SET count = public.rate_limits.count + 1
    RETURNING count INTO v_count;

    -- Return true if limit exceeded
    RETURN (v_count > p_max);
END;
$$;

-- ------------------------------------------------------------------------------
-- 2. Unambiguous Referral Code Generator Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    -- 32-character unambiguous charset (no 0, O, 1, I)
    v_chars TEXT := '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    v_code TEXT := '';
    v_i INT;
    v_exists BOOLEAN;
BEGIN
    LOOP
        v_code := '';
        FOR v_i IN 1..8 LOOP
            v_code := v_code || SUBSTR(v_chars, FLOOR(RANDOM() * 32 + 1)::INT, 1);
        END LOOP;

        SELECT EXISTS(SELECT 1 FROM public.registrations WHERE referral_code = v_code) INTO v_exists;
        IF NOT v_exists THEN
            RETURN v_code;
        END IF;
    END LOOP;
END;
$$;

-- ------------------------------------------------------------------------------
-- 3. Atomic High-Concurrency Student Registration Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.register_student(
    p_email TEXT,
    p_email_normalized TEXT,
    p_phone_hash TEXT,
    p_full_name TEXT,
    p_college_name TEXT,
    p_branch TEXT,
    p_grad_year INT,
    p_skill_level TEXT,
    p_interest TEXT,
    p_language TEXT,
    p_referred_by_code TEXT,
    p_utm_source TEXT,
    p_utm_medium TEXT,
    p_utm_campaign TEXT,
    p_ip_hash TEXT,
    p_consent_marketing BOOLEAN,
    p_join_token TEXT,
    p_is_synthetic BOOLEAN DEFAULT false
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_cap INT;
    v_open BOOLEAN;
    v_verified_count INT;
    v_college_id UUID;
    v_college_norm TEXT;
    v_ref_code TEXT;
    v_referrer_id UUID := NULL;
    v_reg_id UUID;
    v_existing_status TEXT;
    v_existing_id UUID;
BEGIN
    -- 1. Take exclusive lock on app_settings to serialize concurrency checks
    SELECT registration_cap, registration_open
    INTO v_cap, v_open
    FROM public.app_settings
    WHERE id = 1
    FOR UPDATE;

    IF v_open IS FALSE THEN
        RAISE EXCEPTION 'REGISTRATION_CLOSED';
    END IF;

    -- 2. Verify seat capacity
    SELECT COUNT(*)
    INTO v_verified_count
    FROM public.registrations
    WHERE status = 'verified' AND is_synthetic = false;

    IF v_verified_count >= v_cap AND p_is_synthetic IS FALSE THEN
        RAISE EXCEPTION 'CAP_REACHED';
    END IF;

    -- 3. Check for existing normalized email
    SELECT id, status
    INTO v_existing_id, v_existing_status
    FROM public.registrations
    WHERE email_normalized = p_email_normalized;

    IF v_existing_id IS NOT NULL THEN
        IF v_existing_status = 'verified' THEN
            RAISE EXCEPTION 'EMAIL_EXISTS';
        ELSE
            -- Resend scenario: student re-registering while still pending
            RETURN v_existing_id;
        END IF;
    END IF;

    -- 4. Find or create college
    v_college_norm := LOWER(TRIM(p_college_name));
    SELECT id INTO v_college_id
    FROM public.colleges
    WHERE name_normalized = v_college_norm;

    IF v_college_id IS NULL THEN
        INSERT INTO public.colleges (name, name_normalized, is_synthetic)
        VALUES (TRIM(p_college_name), v_college_norm, p_is_synthetic)
        RETURNING id INTO v_college_id;

        INSERT INTO public.college_stats (college_id, college_name, state, is_synthetic)
        VALUES (v_college_id, TRIM(p_college_name), 'Unknown', p_is_synthetic)
        ON CONFLICT (college_id) DO NOTHING;
    END IF;

    -- 5. Validate referral code (must exist and not be self)
    IF p_referred_by_code IS NOT NULL AND TRIM(p_referred_by_code) != '' THEN
        SELECT id INTO v_referrer_id
        FROM public.registrations
        WHERE referral_code = TRIM(p_referred_by_code);
    END IF;

    -- 6. Generate unique referral code
    v_ref_code := public.generate_referral_code();

    -- 7. Insert registration
    INSERT INTO public.registrations (
        email, email_normalized, phone_hash, full_name, college_id,
        branch, grad_year, skill_level, interest, language,
        referral_code, referred_by_code, utm_source, utm_medium, utm_campaign,
        ip_hash, consent_at, consent_marketing, join_token, is_synthetic
    ) VALUES (
        TRIM(p_email), p_email_normalized, p_phone_hash, TRIM(p_full_name), v_college_id,
        p_branch, p_grad_year, p_skill_level, p_interest, p_language,
        v_ref_code, CASE WHEN v_referrer_id IS NOT NULL THEN TRIM(p_referred_by_code) ELSE NULL END,
        p_utm_source, p_utm_medium, p_utm_campaign,
        p_ip_hash, NOW(), p_consent_marketing, p_join_token, p_is_synthetic
    )
    RETURNING id INTO v_reg_id;

    -- 8. Record telemetry event
    INSERT INTO public.campaign_events (
        event_type, registration_id, college_id, session_hash,
        utm_source, utm_medium, utm_campaign, is_synthetic
    ) VALUES (
        'registered', v_reg_id, v_college_id, p_ip_hash,
        p_utm_source, p_utm_medium, p_utm_campaign, p_is_synthetic
    );

    RETURN v_reg_id;
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. Idempotent Registration Verification & Outbox Scheduler Function
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.verify_registration(
    p_registration_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
    v_reg RECORD;
    v_workshop RECORD;
    v_next_seat INT;
    v_referrer RECORD;
    v_ref_count INT;
    v_same_ip_count INT;
BEGIN
    -- 1. Fetch registration record
    SELECT * INTO v_reg
    FROM public.registrations
    WHERE id = p_registration_id
    FOR UPDATE;

    IF v_reg.id IS NULL THEN
        RAISE EXCEPTION 'REGISTRATION_NOT_FOUND';
    END IF;

    -- If already verified, return idempotent success payload
    IF v_reg.status = 'verified' THEN
        RETURN jsonb_build_object(
            'registration_id', v_reg.id,
            'seat_number', v_reg.seat_number,
            'referral_code', v_reg.referral_code,
            'join_token', v_reg.join_token,
            'status', 'verified',
            'already_verified', true
        );
    END IF;

    -- 2. Assign unique sequential seat number
    SELECT COALESCE(MAX(seat_number), 0) + 1
    INTO v_next_seat
    FROM public.registrations;

    -- 3. Update registration to verified
    UPDATE public.registrations
    SET status = 'verified',
        email_verified_at = COALESCE(email_verified_at, NOW()),
        seat_number = v_next_seat
    WHERE id = p_registration_id;

    -- 4. Update College Stats
    UPDATE public.college_stats
    SET verified_count = verified_count + 1,
        updated_at = NOW()
    WHERE college_id = v_reg.college_id;

    -- 5. Process Referral Attribution & Anti-Fraud
    IF v_reg.referred_by_code IS NOT NULL THEN
        SELECT id, ip_hash, email_normalized, phone_hash
        INTO v_referrer
        FROM public.registrations
        WHERE referral_code = v_reg.referred_by_code;

        IF v_referrer.id IS NOT NULL THEN
            -- Check Anti-fraud rules
            IF v_referrer.id = v_reg.id THEN
                -- Self referral
                INSERT INTO public.referrals (referrer_id, referred_id, status, reject_reason)
                VALUES (v_referrer.id, v_reg.id, 'rejected', 'SELF_REFERRAL')
                ON CONFLICT (referred_id) DO NOTHING;
            ELSIF v_referrer.email_normalized = v_reg.email_normalized THEN
                -- Duplicate email
                INSERT INTO public.referrals (referrer_id, referred_id, status, reject_reason)
                VALUES (v_referrer.id, v_reg.id, 'rejected', 'SAME_EMAIL')
                ON CONFLICT (referred_id) DO NOTHING;
            ELSIF v_reg.phone_hash IS NOT NULL AND v_referrer.phone_hash = v_reg.phone_hash THEN
                -- Duplicate phone
                INSERT INTO public.referrals (referrer_id, referred_id, status, reject_reason)
                VALUES (v_referrer.id, v_reg.id, 'rejected', 'SAME_PHONE')
                ON CONFLICT (referred_id) DO NOTHING;
            ELSE
                -- Check duplicate IP threshold (max 4 per referrer from same IP)
                SELECT COUNT(*) INTO v_same_ip_count
                FROM public.registrations r
                JOIN public.referrals ref ON ref.referred_id = r.id
                WHERE ref.referrer_id = v_referrer.id AND r.ip_hash = v_reg.ip_hash;

                IF v_same_ip_count >= 4 THEN
                    INSERT INTO public.referrals (referrer_id, referred_id, status, reject_reason)
                    VALUES (v_referrer.id, v_reg.id, 'rejected', 'IP_FLOOD_DETECTED')
                    ON CONFLICT (referred_id) DO NOTHING;
                ELSE
                    -- Valid referral
                    INSERT INTO public.referrals (referrer_id, referred_id, status, verified_at)
                    VALUES (v_referrer.id, v_reg.id, 'verified', NOW())
                    ON CONFLICT (referred_id) DO UPDATE SET status = 'verified', verified_at = NOW();

                    -- Check referrer milestone unlocks (3 and 10)
                    SELECT COUNT(*) INTO v_ref_count
                    FROM public.referrals
                    WHERE referrer_id = v_referrer.id AND status = 'verified';

                    IF v_ref_count >= 3 THEN
                        INSERT INTO public.milestones (registration_id, kind)
                        VALUES (v_referrer.id, 'refs_3')
                        ON CONFLICT (registration_id, kind) DO NOTHING;

                        UPDATE public.registrations SET priority_access = true WHERE id = v_referrer.id;

                        INSERT INTO public.notifications (registration_id, kind, run_at)
                        VALUES (v_referrer.id, 'milestone', NOW())
                        ON CONFLICT (registration_id, kind) WHERE kind != 'otp' DO NOTHING;
                    END IF;

                    IF v_ref_count >= 10 THEN
                        INSERT INTO public.milestones (registration_id, kind)
                        VALUES (v_referrer.id, 'refs_10')
                        ON CONFLICT (registration_id, kind) DO NOTHING;

                        INSERT INTO public.notifications (registration_id, kind, run_at)
                        VALUES (v_referrer.id, 'milestone', NOW())
                        ON CONFLICT (registration_id, kind) WHERE kind != 'otp' DO NOTHING;
                    END IF;
                END IF;
            END IF;
        END IF;
    END IF;

    -- 6. Schedule Outbox Notifications
    SELECT workshop_starts_at INTO v_workshop FROM public.app_settings WHERE id = 1;

    -- Enqueue Welcome & Blueprint notifications
    INSERT INTO public.notifications (registration_id, kind, run_at)
    VALUES 
        (v_reg.id, 'welcome', NOW()),
        (v_reg.id, 'blueprint', NOW())
    ON CONFLICT (registration_id, kind) WHERE kind != 'otp' DO NOTHING;

    -- Enqueue Reminder Notifications if target window has not yet passed
    IF v_workshop.workshop_starts_at - INTERVAL '24 hours' > NOW() THEN
        INSERT INTO public.notifications (registration_id, kind, run_at)
        VALUES (v_reg.id, 'reminder_24h', v_workshop.workshop_starts_at - INTERVAL '24 hours')
        ON CONFLICT (registration_id, kind) WHERE kind != 'otp' DO NOTHING;
    END IF;

    IF v_workshop.workshop_starts_at - INTERVAL '2 hours' > NOW() THEN
        INSERT INTO public.notifications (registration_id, kind, run_at)
        VALUES (v_reg.id, 'reminder_2h', v_workshop.workshop_starts_at - INTERVAL '2 hours')
        ON CONFLICT (registration_id, kind) WHERE kind != 'otp' DO NOTHING;
    END IF;

    IF v_workshop.workshop_starts_at - INTERVAL '15 minutes' > NOW() THEN
        INSERT INTO public.notifications (registration_id, kind, run_at)
        VALUES (v_reg.id, 'reminder_15m', v_workshop.workshop_starts_at - INTERVAL '15 minutes')
        ON CONFLICT (registration_id, kind) WHERE kind != 'otp' DO NOTHING;
    END IF;

    -- 7. Record Telemetry Event
    INSERT INTO public.campaign_events (
        event_type, registration_id, college_id, session_hash
    ) VALUES (
        'verified', v_reg.id, v_reg.college_id, v_reg.ip_hash
    );

    RETURN jsonb_build_object(
        'registration_id', v_reg.id,
        'seat_number', v_next_seat,
        'referral_code', v_reg.referral_code,
        'join_token', v_reg.join_token,
        'status', 'verified',
        'already_verified', false
    );
END;
$$;

-- ------------------------------------------------------------------------------
-- 5. Atomic Outbox Batch Claiming Function (SKIP LOCKED)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_notifications(
    p_batch INT DEFAULT 10
)
RETURNS SETOF public.notifications
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
    -- 1. Requeue tasks stuck in processing for over 10 minutes
    UPDATE public.notifications
    SET status = 'pending',
        claimed_at = NULL
    WHERE status = 'processing'
      AND claimed_at < NOW() - INTERVAL '10 minutes';

    -- 2. Atomically claim batch of pending notifications ready to run
    RETURN QUERY
    WITH claimed AS (
        SELECT id
        FROM public.notifications
        WHERE status = 'pending'
          AND run_at <= NOW()
        ORDER BY run_at ASC
        LIMIT p_batch
        FOR UPDATE SKIP LOCKED
    )
    UPDATE public.notifications n
    SET status = 'processing',
        claimed_at = NOW(),
        attempts = n.attempts + 1
    FROM claimed c
    WHERE n.id = c.id
    RETURNING n.*;
END;
$$;
