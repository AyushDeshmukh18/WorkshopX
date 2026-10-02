-- ==============================================================================
-- FirstBuild Engine Seed Data
-- ==============================================================================

-- 1. Initialize Singleton App Settings
INSERT INTO public.app_settings (
    id,
    workshop_name,
    workshop_starts_at,
    join_url,
    registration_cap,
    registration_open,
    certificate_threshold,
    physical_address_line,
    sim_outreach_count,
    sim_reply_rate,
    sim_regs_per_captain,
    sim_share_rate,
    sim_k_factor,
    sim_show_up_rate
) VALUES (
    1,
    'Build Your First AI Project in 60 Minutes',
    NOW() + INTERVAL '7 days',
    'https://meet.google.com/xyz-sample',
    500,
    true,
    50,
    'FirstBuild Technical Education Initiative, Hyderabad, Telangana, India',
    150,
    0.200,
    8.50,
    0.350,
    0.350,
    0.420
) ON CONFLICT (id) DO UPDATE SET
    workshop_name = EXCLUDED.workshop_name,
    updated_at = NOW();

-- 2. Seed High-Intent Tier-2/3 Engineering Colleges
DO $$
DECLARE
    college_record RECORD;
    new_college_id UUID;
    colleges_list TEXT[][] := ARRAY[
        ['JNTU College of Engineering Hyderabad', 'Telangana'],
        ['Chaitanya Bharathi Institute of Technology (CBIT)', 'Telangana'],
        ['Vasavi College of Engineering', 'Telangana'],
        ['VNR Vignana Jyothi Institute of Engineering', 'Telangana'],
        ['Gokaraju Rangaraju Institute of Engineering (GRIET)', 'Telangana'],
        ['CVR College of Engineering', 'Telangana'],
        ['Sreenidhi Institute of Science and Technology (SNIST)', 'Telangana'],
        ['Andhra University College of Engineering', 'Andhra Pradesh'],
        ['Gayatri Vidya Parishad College of Engineering', 'Andhra Pradesh'],
        ['RVR & JC College of Engineering, Guntur', 'Andhra Pradesh'],
        ['VR Siddhartha Engineering College, Vijayawada', 'Andhra Pradesh'],
        ['SRKR Engineering College, Bhimavaram', 'Andhra Pradesh'],
        ['G. Pulla Reddy Engineering College, Kurnool', 'Andhra Pradesh'],
        ['COEP Technological University, Pune', 'Maharashtra'],
        ['Vishwakarma Institute of Technology (VIT Pune)', 'Maharashtra'],
        ['Walchand College of Engineering, Sangli', 'Maharashtra'],
        ['Shri Ramdeobaba College of Engineering, Nagpur', 'Maharashtra'],
        ['Government College of Engineering, Amravati', 'Maharashtra'],
        ['BMS College of Engineering, Bengaluru', 'Karnataka'],
        ['MS Ramaiah Institute of Technology', 'Karnataka'],
        ['Siddaganga Institute of Technology, Tumakuru', 'Karnataka'],
        ['National Institute of Engineering (NIE Mysuru)', 'Karnataka'],
        ['PSG College of Technology, Coimbatore', 'Tamil Nadu'],
        ['Thiagarajar College of Engineering, Madurai', 'Tamil Nadu'],
        ['Coimbatore Institute of Technology (CIT)', 'Tamil Nadu'],
        ['Harcourt Butler Technical University (HBTU Kanpur)', 'Uttar Pradesh'],
        ['Kamla Nehru Institute of Technology (KNIT Sultanpur)', 'Uttar Pradesh'],
        ['Bundelkhand Institute of Engineering (BIET Jhansi)', 'Uttar Pradesh'],
        ['Madan Mohan Malaviya University of Tech (MMMUT)', 'Uttar Pradesh'],
        ['Guru Gobind Singh Indraprastha University (GGSIPU)', 'Delhi NCR'],
        ['Maharaja Agrasen Institute of Technology (MAIT)', 'Delhi NCR']
    ];
BEGIN
    FOR i IN 1..array_length(colleges_list, 1) LOOP
        INSERT INTO public.colleges (name, name_normalized, state, is_synthetic)
        VALUES (
            colleges_list[i][1],
            LOWER(TRIM(colleges_list[i][1])),
            colleges_list[i][2],
            false
        )
        ON CONFLICT (name_normalized) DO NOTHING
        RETURNING id INTO new_college_id;

        IF new_college_id IS NOT NULL THEN
            INSERT INTO public.college_stats (college_id, college_name, state, verified_count, attended_count, is_synthetic)
            VALUES (new_college_id, colleges_list[i][1], colleges_list[i][2], 0, 0, false)
            ON CONFLICT (college_id) DO NOTHING;
        END IF;
    END LOOP;
END;
$$;

-- 3. Seed Initial Workshop Poll for Live Room
DO $$
DECLARE
    v_poll_id UUID;
BEGIN
    INSERT INTO public.polls (question, is_active)
    VALUES ('What is your primary programming language for building projects?', true)
    RETURNING id INTO v_poll_id;

    INSERT INTO public.poll_options (poll_id, option_text, display_order)
    VALUES 
        (v_poll_id, 'Python', 1),
        (v_poll_id, 'JavaScript / TypeScript', 2),
        (v_poll_id, 'Java / C++', 3),
        (v_poll_id, 'None yet (Complete beginner)', 4);
END;
$$;
