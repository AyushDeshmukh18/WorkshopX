import { z } from 'zod';
import { BranchEnum } from './blueprint-schema';

export const TargetCompanyEnum = z.enum([
  'tcs-digital',
  'cognizant-genc',
  'infosys-specialist',
  'amazon-sde',
  'fintech-startup',
]);
export type TargetCompany = z.infer<typeof TargetCompanyEnum>;

export const TARGET_COMPANY_METADATA: Record<
  TargetCompany,
  { name: string; ctc: string; tier: string; focus: string }
> = {
  'tcs-digital': {
    name: 'TCS Digital / Prime',
    ctc: '₹7.5 – ₹9.0 LPA',
    tier: 'Tier 1 Campus Differential',
    focus: 'AI/ML, Microservices, Cloud Architectures, Problem Solving',
  },
  'cognizant-genc': {
    name: 'Cognizant GenC Next',
    ctc: '₹6.75 – ₹8.5 LPA',
    tier: 'Advanced Tech Track',
    focus: 'Full-Stack, GenAI Integration, API Design, Scalable Web',
  },
  'infosys-specialist': {
    name: 'Infosys Specialist Programmer',
    ctc: '₹9.5 – ₹11.0 LPA',
    tier: 'Core Specialist',
    focus: 'Production System Design, Concurrency, Algorithms, Deployment',
  },
  'amazon-sde': {
    name: 'Amazon SDE-1 / Top Startups',
    ctc: '₹18.0 – ₹24.0 LPA',
    tier: 'Product Engineering',
    focus: 'Distributed Systems, Real-Time Architecture, Latency Optimization',
  },
  'fintech-startup': {
    name: 'FinTech / High-Growth AI Startup',
    ctc: '₹12.0 – ₹16.0 LPA',
    tier: 'Fast-Paced Engineering',
    focus: 'GenAI Workflows, Vector Embeddings, Next.js, Realtime Pipelines',
  },
};

export const AtsScanRequestSchema = z.object({
  resume_text: z
    .string()
    .min(30, 'Resume text must be at least 30 characters')
    .max(30000, 'Resume text cannot exceed 30,000 characters'),
  target_company: TargetCompanyEnum.default('tcs-digital'),
  branch: BranchEnum.optional().default('CSE'),
});
export type AtsScanRequest = z.infer<typeof AtsScanRequestSchema>;

export const AtsScanResponseSchema = z.object({
  current_ats_score: z.number().int().min(30).max(85),
  projected_ats_score: z.number().int().min(80).max(98),
  score_delta: z.number().int().min(10).max(50),
  missing_placement_keywords: z.array(z.string()).min(2).max(8),
  found_keywords: z.array(z.string()).min(1).max(10),
  critical_critique: z.string().min(20).max(800),
  post_workshop_bullet: z.string().min(30).max(400),
  why_this_bullet_wins: z.string().min(15).max(400),
  suggested_project_title: z.string().min(5).max(120),
  company_name: z.string(),
  target_ctc: z.string(),
  source: z.enum(['openrouter', 'gemini', 'heuristic']),
});
export type AtsScanResponse = z.infer<typeof AtsScanResponseSchema>;
