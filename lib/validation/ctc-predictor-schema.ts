import { z } from 'zod';
import { BranchEnum } from './blueprint-schema';

export const BacklogStatusEnum = z.enum(['none', 'cleared', 'active']);
export type BacklogStatus = z.infer<typeof BacklogStatusEnum>;

export const ProjectExperienceEnum = z.enum([
  'none',
  'academic-crud',
  'mini-project',
  'hackathon-prototype',
]);
export type ProjectExperience = z.infer<typeof ProjectExperienceEnum>;

export const CtcPredictorRequestSchema = z.object({
  cgpa: z.number().min(4.0).max(10.0),
  branch: BranchEnum.default('CSE'),
  backlog_status: BacklogStatusEnum.default('none'),
  project_experience: ProjectExperienceEnum.default('academic-crud'),
  dream_role: z.string().optional().default('AI / Full-Stack Software Engineer'),
});
export type CtcPredictorRequest = z.infer<typeof CtcPredictorRequestSchema>;

export const CompanyEligibilityItemSchema = z.object({
  company: z.string(),
  ctc_range: z.string(),
  track_name: z.string(),
  eligible: z.boolean(),
  eligibility_status: z.enum(['eligible', 'conditional', 'blocked']),
  requirement_note: z.string(),
});

export const CtcPredictorResponseSchema = z.object({
  current_tier_name: z.string(),
  current_estimated_ctc: z.string(),
  projected_tier_name: z.string(),
  projected_estimated_ctc: z.string(),
  ctc_leap_amount: z.string(),
  three_year_compounding_delta: z.string(),
  eligibility_verdict: z.string(),
  company_eligibility: z.array(CompanyEligibilityItemSchema).min(3).max(6),
  the_3_milestone_leap_plan: z.array(
    z.object({
      milestone: z.string(),
      description: z.string(),
      action: z.string(),
    })
  ).length(3),
  why_workshop_bridges_the_gap: z.string(),
  source: z.enum(['openrouter', 'gemini', 'heuristic']),
});
export type CtcPredictorResponse = z.infer<typeof CtcPredictorResponseSchema>;
