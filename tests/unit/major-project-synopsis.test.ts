import { describe, it, expect } from 'vitest';
import { runHeuristicSynopsis } from '@/lib/projects/synopsis-generator';
import { MajorProjectResponseSchema } from '@/lib/validation/major-project-schema';

describe('AI Major Project Report & IEEE Synopsis Generator', () => {
  it('generates academic-grade IEEE synopsis for CSE and passes Zod schema validation', () => {
    const result = runHeuristicSynopsis('CSE', 'AI');

    expect(result).toBeDefined();
    const parsed = MajorProjectResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);

    expect(result.ieee_abstract.length).toBeGreaterThan(100);
    expect(result.problem_statement).toBeTruthy();
    expect(result.existing_system_drawbacks.length).toBeGreaterThanOrEqual(2);
    expect(result.proposed_system_innovations.length).toBeGreaterThanOrEqual(2);
    expect(result.system_architecture_mermaid).toContain('graph TD');
    expect(result.viva_defense_qa.length).toBeGreaterThanOrEqual(2);
  });

  it('generates customized specifications across different engineering branches (ECE)', () => {
    const result = runHeuristicSynopsis('ECE', 'EMBEDDED');

    expect(result).toBeDefined();
    expect(result.branch).toBe('ECE');
    expect(result.hardware_software_requirements.hardware.length).toBeGreaterThan(0);
    expect(result.viva_defense_qa[0].examiner_focus).toBeTruthy();
  });
});
