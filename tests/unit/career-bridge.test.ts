import { describe, it, expect } from 'vitest';
import { generateCareerBridgeRoadmap } from '@/lib/career-bridge/roadmap-generator';
import { CareerBridgeResponseSchema } from '@/lib/validation/non-cse-roadmap-schema';

describe('Non-CSE to Tech Career Bridge Roadmap Planner', () => {
  it('generates 90-day transition roadmap for Mechanical Engineering and passes schema validation', async () => {
    const input = {
      branch: 'mechanical' as const,
      current_year: '3rd-year' as const,
      prior_experience: 'basic-c-or-python' as const,
      target_role: 'Full-Stack Software Development Engineer (SDE-1)',
      target_ctc_tier: '₹8.5–12 LPA',
    };

    const result = await generateCareerBridgeRoadmap(input);
    expect(result).toBeDefined();

    const parsed = CareerBridgeResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.branch_display_name).toContain('Mechanical');
    expect(result.phases.length).toBe(3);
    expect(result.phases[0].phase_title).toContain('Phase 1');
    expect(result.phases[1].phase_title).toContain('Phase 2');
    expect(result.phases[2].phase_title).toContain('Phase 3');
    expect(result.verified_alumni_stories.length).toBeGreaterThanOrEqual(2);
    expect(result.critical_pitfalls_to_avoid.length).toBeGreaterThanOrEqual(2);
    expect(result.day_1_action_item.length).toBeGreaterThan(15);
  }, 15000);

  it('handles Civil Engineering branch accurately with verified stories', async () => {
    const input = {
      branch: 'civil' as const,
      current_year: '4th-year' as const,
      prior_experience: 'absolute-beginner' as const,
      target_role: 'Full-Stack Web Developer',
      target_ctc_tier: '₹7.5 LPA',
    };

    const result = await generateCareerBridgeRoadmap(input);
    const parsed = CareerBridgeResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);
    expect(result.branch_display_name).toContain('Civil');
  }, 15000);
});
