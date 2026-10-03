import { z } from 'zod';

export const NewsArticleItemSchema = z.object({
  id: z.union([z.string(), z.number()]),
  title: z.string(),
  description: z.string().optional().default(''),
  url: z.string().url(),
  source: z.string(),
  published_at: z.string(),
  reading_time_minutes: z.number().optional().default(4),
  tags: z.array(z.string()).default([]),
  author: z.string().optional().default('Tech Contributor'),
  cover_image: z.string().nullable().optional(),
});
export type NewsArticleItem = z.infer<typeof NewsArticleItemSchema>;

export const TrendingRepoItemSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable().optional(),
  html_url: z.string().url(),
  stargazers_count: z.number(),
  language: z.string().nullable().optional(),
  topics: z.array(z.string()).default([]),
});
export type TrendingRepoItem = z.infer<typeof TrendingRepoItemSchema>;

export const SalaryPulseItemSchema = z.object({
  role_title: z.string(),
  experience_level: z.string(),
  average_ctc_india: z.string(),
  yoy_demand_growth: z.string(),
  core_stack: z.array(z.string()),
  category: z.enum(['ai-differential', 'modern-web', 'legacy-service']),
});
export type SalaryPulseItem = z.infer<typeof SalaryPulseItemSchema>;

export const TechTrendsResponseSchema = z.object({
  articles: z.array(NewsArticleItemSchema),
  hacker_news: z.array(NewsArticleItemSchema),
  trending_repos: z.array(TrendingRepoItemSchema),
  salary_pulse: z.array(SalaryPulseItemSchema),
  last_updated: z.string(),
  source: z.enum(['live-api', 'cached', 'fallback']),
});
export type TechTrendsResponse = z.infer<typeof TechTrendsResponseSchema>;
