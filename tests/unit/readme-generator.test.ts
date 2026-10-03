import { describe, it, expect } from 'vitest';
import { generateReadme } from '@/lib/readme/readme-generator';
import { ReadmeGeneratorResponseSchema } from '@/lib/validation/readme-schema';

describe('FAANG-Grade GitHub README & System Architecture Visualizer', () => {
  it('generates professional GitHub README markdown with Mermaid architecture', async () => {
    const input = {
      project_title: 'OmniFlow AI Placement Orchestrator',
      project_tagline: 'Autonomous AI interview agent with sub-second voice latency & tamper-proof verification',
      domain: 'generative-ai' as const,
      core_features: 'Streaming WebSocket voice loop, automated resume vector retrieval, tamper-proof cryptographic badges',
      tech_stack: 'Next.js 16, TypeScript, OpenRouter Llama 3.3, TailwindCSS, Supabase',
      demo_url: 'https://omniflow.vercel.app',
      github_repo_url: 'https://github.com/nxtwave-student/omniflow-ai',
    };

    const result = await generateReadme(input);
    expect(result).toBeDefined();

    const parsed = ReadmeGeneratorResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.markdown_content).toContain('OmniFlow AI Placement Orchestrator');
    expect(result.markdown_content).toContain('graph TD');
    expect(result.mermaid_diagram).toContain('graph TD');
    expect(result.badges.length).toBeGreaterThanOrEqual(2);
    expect(result.key_highlights.length).toBeGreaterThanOrEqual(2);
  }, 15000);
});
