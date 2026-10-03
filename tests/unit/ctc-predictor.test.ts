import { describe, it, expect } from 'vitest';
import { runHeuristicCtcPrediction } from '@/lib/placement/ctc-predictor';
import { CtcPredictorResponseSchema } from '@/lib/validation/ctc-predictor-schema';

describe('Placement Eligibility & CTC Tier Leap Predictor', () => {
  it('predicts CTC leap for standard final year student and passes Zod schema validation', () => {
    const result = runHeuristicCtcPrediction(7.4, 'CSE', 'none', 'academic-crud');

    expect(result).toBeDefined();
    const parsed = CtcPredictorResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.current_estimated_ctc).toContain('LPA');
    expect(result.projected_estimated_ctc).toContain('LPA');
    expect(result.ctc_leap_amount).toContain('+');
    expect(result.company_eligibility.length).toBeGreaterThanOrEqual(3);
    expect(result.the_3_milestone_leap_plan).toHaveLength(3);
  });

  it('handles active backlog profiles by adapting company eligibility', () => {
    const result = runHeuristicCtcPrediction(6.8, 'ECE', 'active', 'academic-crud');

    expect(result.current_tier_name).toContain('High Risk');
    expect(result.projected_tier_name).toContain('Startup');

    const tcs = result.company_eligibility.find((c) => c.company.includes('TCS'));
    expect(tcs?.eligibility_status).toBe('blocked');

    const startups = result.company_eligibility.find((c) => c.company.includes('Startup'));
    expect(startups?.eligibility_status).toBe('eligible');
  });

  it('highlights differential package tracks for high CGPA candidates', () => {
    const result = runHeuristicCtcPrediction(8.8, 'CSE', 'none', 'mini-project');

    expect(result.projected_estimated_ctc).toContain('14.00');
    expect(result.the_3_milestone_leap_plan[0].action).toBeTruthy();
  });
});
