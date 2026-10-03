import { z } from 'zod';

export const RecipientRoleSchema = z.enum([
  'recruiter',
  'engineering-manager',
  'startup-founder',
  'alumni',
]);
export type RecipientRole = z.infer<typeof RecipientRoleSchema>;

export const ColdPitchRequestSchema = z.object({
  student_name: z.string().min(2, 'Name is required').max(60),
  student_branch: z.string().min(2, 'Branch is required').max(50),
  target_company: z.string().min(2, 'Target company is required').max(60),
  recipient_role: RecipientRoleSchema,
  recipient_name: z.string().max(60).optional().default('Hiring Team'),
  project_title: z.string().min(3, 'Project title is required').max(100),
  project_live_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github_repo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  key_tech_stack: z.string().min(2, 'Tech stack is required').max(150),
});
export type ColdPitchRequest = z.infer<typeof ColdPitchRequestSchema>;

export const ColdPitchResponseSchema = z.object({
  linkedin_dm_75_words: z.string().min(50),
  cold_email_subject: z.string().min(10),
  cold_email_body: z.string().min(100),
  followup_day_3: z.string().min(50),
  followup_day_7: z.string().min(50),
  pitch_strategy_tips: z.array(z.string()).min(3),
  estimated_reply_rate: z.string(),
  proof_of_work_highlight: z.string(),
});
export type ColdPitchResponse = z.infer<typeof ColdPitchResponseSchema>;
