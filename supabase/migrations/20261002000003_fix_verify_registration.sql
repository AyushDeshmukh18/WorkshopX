-- ==============================================================================
-- Fix verify_registration ON CONFLICT clause to match uq_notifications_reg_kind partial index
-- Run this in Supabase SQL Editor
-- ==============================================================================

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
