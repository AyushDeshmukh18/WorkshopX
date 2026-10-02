import { z } from 'zod';

export const BranchEnum = z.enum(['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL']);
export type Branch = z.infer<typeof BranchEnum>;

export const InterestEnum = z.enum(['AI', 'WEB', 'DATA', 'MOBILE', 'EMBEDDED']);
export type Interest = z.infer<typeof InterestEnum>;

export const SkillLevelEnum = z.enum(['beginner', 'intermediate', 'advanced']);
export type SkillLevel = z.infer<typeof SkillLevelEnum>;

export const BlueprintRequestSchema = z.object({
  branch: BranchEnum,
  interest: InterestEnum,
  skill_level: SkillLevelEnum,
});
export type BlueprintRequest = z.infer<typeof BlueprintRequestSchema>;

export const BlueprintPayloadSchema = z.object({
  project_name: z.string().min(3).max(120),
  one_liner: z.string().min(10).max(250),
  what_youll_build_in_60_min: z.string().min(20).max(600),
  stack: z.array(z.string().min(1)).min(2).max(8),
  resume_bullet: z.string().min(20).max(350),
  match_score: z.number().int().min(60).max(98),
  first_3_steps: z.array(z.string().min(5)).length(3),
  why_it_fits: z.string().min(15).max(500),
});
export type BlueprintPayload = z.infer<typeof BlueprintPayloadSchema>;

export const BlueprintTeaserSchema = z.object({
  project_name: z.string(),
  one_liner: z.string(),
  match_score: z.number().int().min(60).max(98),
  branch: BranchEnum,
  interest: InterestEnum,
  skill_level: SkillLevelEnum,
  teaser_only: z.literal(true),
});
export type BlueprintTeaser = z.infer<typeof BlueprintTeaserSchema>;
