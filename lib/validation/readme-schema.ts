import { z } from 'zod';

export const ProjectDomainSchema = z.enum([
  'generative-ai',
  'full-stack',
  'distributed-systems',
  'cloud-devops',
  'mobile-iot',
]);
export type ProjectDomain = z.infer<typeof ProjectDomainSchema>;

export const ReadmeGeneratorRequestSchema = z.object({
  project_title: z.string().min(2, 'Project title is required').max(100),
  project_tagline: z.string().min(5, 'Project tagline is required').max(200),
  domain: ProjectDomainSchema,
  core_features: z.string().min(10, 'Core features are required').max(500),
  tech_stack: z.string().min(3, 'Tech stack is required').max(200),
  demo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  github_repo_url: z.string().url('Must be a valid URL').optional().or(z.literal('')),
});
export type ReadmeGeneratorRequest = z.infer<typeof ReadmeGeneratorRequestSchema>;

export const ReadmeGeneratorResponseSchema = z.object({
  markdown_content: z.string().min(150),
  mermaid_diagram: z.string().min(30),
  badges: z.array(z.string()).min(2),
  key_highlights: z.array(z.string()).min(2),
});
export type ReadmeGeneratorResponse = z.infer<typeof ReadmeGeneratorResponseSchema>;
