import { z } from 'zod';
import { BranchEnum } from './blueprint-schema';
import { TargetCompanyEnum } from './ats-schema';

export const GitHubAuditRequestSchema = z.object({
  username_or_url: z
    .string()
    .min(1, 'Please enter a GitHub username or profile URL')
    .max(200, 'GitHub URL/username is too long'),
  target_company: TargetCompanyEnum.optional().default('tcs-digital'),
  branch: BranchEnum.optional().default('CSE'),
});
export type GitHubAuditRequest = z.infer<typeof GitHubAuditRequestSchema>;

export const GitHubAuditResponseSchema = z.object({
  username: z.string(),
  avatar_url: z.string(),
  bio: z.string().nullable().optional(),
  public_repos_count: z.number().int().nonnegative(),
  followers_count: z.number().int().nonnegative(),
  top_languages: z.array(z.string()).max(6),
  total_stars: z.number().int().nonnegative(),
  recruiter_score: z.number().int().min(25).max(75),
  projected_score: z.number().int().min(80).max(98),
  score_delta: z.number().int().min(10).max(60),
  critical_flaws: z.array(z.string()).min(2).max(6),
  strengths: z.array(z.string()).min(1).max(5),
  the_60_min_fix: z.object({
    repo_name: z.string(),
    one_liner: z.string(),
    stack: z.array(z.string()),
    recruiter_impact: z.string(),
  }),
  company_name: z.string(),
  source: z.enum(['openrouter', 'gemini', 'heuristic']),
});
export type GitHubAuditResponse = z.infer<typeof GitHubAuditResponseSchema>;
