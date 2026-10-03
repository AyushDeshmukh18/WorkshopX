import { z } from 'zod';

export const NonCseBranchSchema = z.enum([
  'mechanical',
  'civil',
  'eee',
  'chemical',
  'biotech',
  'metallurgy',
  'other-non-it',
]);
export type NonCseBranch = z.infer<typeof NonCseBranchSchema>;

export const StudentYearSchema = z.enum([
  '1st-year',
  '2nd-year',
  '3rd-year',
  '4th-year',
  'recent-graduate',
]);
export type StudentYear = z.infer<typeof StudentYearSchema>;

export const CodingExperienceSchema = z.enum([
  'absolute-beginner',
  'basic-c-or-python',
  'moderate',
]);
export type CodingExperience = z.infer<typeof CodingExperienceSchema>;

export const CareerBridgeRequestSchema = z.object({
  branch: NonCseBranchSchema,
  current_year: StudentYearSchema,
  prior_experience: CodingExperienceSchema,
  target_role: z.string().min(2).max(60),
  target_ctc_tier: z.string().min(2).max(40),
});
export type CareerBridgeRequest = z.infer<typeof CareerBridgeRequestSchema>;

export const WeeklyMilestoneSchema = z.object({
  week: z.string(),
  title: z.string(),
  focus_topics: z.array(z.string()).min(2),
  milestone_project: z.string(),
  hours_per_week: z.number().int().min(5).max(40),
});
export type WeeklyMilestone = z.infer<typeof WeeklyMilestoneSchema>;

export const RoadmapPhaseSchema = z.object({
  phase_number: z.number().int().min(1).max(3),
  phase_title: z.string(),
  phase_duration: z.string(),
  phase_objective: z.string(),
  weekly_milestones: z.array(WeeklyMilestoneSchema).min(2),
  free_learning_resources: z.array(z.string()).min(1),
});
export type RoadmapPhase = z.infer<typeof RoadmapPhaseSchema>;

export const BranchSuccessStorySchema = z.object({
  name: z.string(),
  original_branch: z.string(),
  college_tier: z.string(),
  placed_company: z.string(),
  package_lpa: z.string(),
  key_breakthrough: z.string(),
});
export type BranchSuccessStory = z.infer<typeof BranchSuccessStorySchema>;

export const CareerBridgeResponseSchema = z.object({
  branch_display_name: z.string(),
  superpower_quote: z.string(),
  core_engineering_advantages: z.array(z.string()).min(2),
  phases: z.array(RoadmapPhaseSchema).length(3),
  verified_alumni_stories: z.array(BranchSuccessStorySchema).min(2),
  critical_pitfalls_to_avoid: z.array(z.string()).min(2),
  day_1_action_item: z.string(),
});
export type CareerBridgeResponse = z.infer<typeof CareerBridgeResponseSchema>;
