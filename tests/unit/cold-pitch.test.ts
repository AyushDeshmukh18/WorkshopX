import { describe, it, expect } from 'vitest';
import { generateColdPitch } from '@/lib/outreach/pitch-generator';
import { ColdPitchResponseSchema } from '@/lib/validation/cold-pitch-schema';

describe('Cold Pitch & Recruiter LinkedIn InMail Generator', () => {
  it('generates high-converting cold outreach packages and validates schema', async () => {
    const input = {
      student_name: 'Ananya Sharma',
      student_branch: 'Computer Science Engineering',
      target_company: 'Razorpay',
      recipient_role: 'engineering-manager' as const,
      recipient_name: 'Vikram Mehta',
      project_title: 'Real-Time AI Placement ATS Scanner',
      project_live_url: 'https://ats-doctor.vercel.app',
      github_repo_url: 'https://github.com/ananya-sharma/ats-doctor',
      key_tech_stack: 'Next.js 16, OpenRouter, Supabase, TypeScript',
    };

    const result = await generateColdPitch(input);
    expect(result).toBeDefined();

    const parsed = ColdPitchResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.linkedin_dm_75_words).toContain('Razorpay');
    expect(result.cold_email_subject).toContain('Razorpay');
    expect(result.cold_email_body).toContain('Ananya Sharma');
    expect(result.followup_day_3.length).toBeGreaterThan(20);
    expect(result.followup_day_7.length).toBeGreaterThan(20);
    expect(result.pitch_strategy_tips.length).toBeGreaterThanOrEqual(3);
  }, 15000);
});
