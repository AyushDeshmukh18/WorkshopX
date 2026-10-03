import { z } from 'zod';
import { BranchEnum, InterestEnum } from './blueprint-schema';

export const MajorProjectRequestSchema = z.object({
  branch: BranchEnum.default('CSE'),
  domain: InterestEnum.default('AI'),
  project_title: z.string().optional(),
  team_size: z.number().int().min(1).max(4).default(3),
});
export type MajorProjectRequest = z.infer<typeof MajorProjectRequestSchema>;

export const VivaDefenseItemSchema = z.object({
  question: z.string(),
  answer: z.string(),
  examiner_focus: z.string(),
});

export const MajorProjectResponseSchema = z.object({
  project_title: z.string().min(5).max(150),
  branch: z.string(),
  domain: z.string(),
  ieee_abstract: z.string().min(80).max(1500),
  problem_statement: z.string().min(40).max(600),
  existing_system_drawbacks: z.array(z.string()).min(2).max(5),
  proposed_system_innovations: z.array(z.string()).min(2).max(5),
  system_architecture_mermaid: z.string().min(20),
  hardware_software_requirements: z.object({
    hardware: z.array(z.string()),
    software: z.array(z.string()),
  }),
  viva_defense_qa: z.array(VivaDefenseItemSchema).min(2).max(4),
  source: z.enum(['openrouter', 'gemini', 'heuristic']),
});
export type MajorProjectResponse = z.infer<typeof MajorProjectResponseSchema>;
