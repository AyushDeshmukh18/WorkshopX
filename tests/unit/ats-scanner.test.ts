import { describe, it, expect } from 'vitest';
import { runHeuristicAtsScan } from '@/lib/ats/ats-analyzer';
import {
  AtsScanResponseSchema,
  TARGET_COMPANY_METADATA,
  type TargetCompany,
} from '@/lib/validation/ats-schema';

describe('ATS Resume Scanner & Placement Match Bullet Simulator', () => {
  const sampleResume = `
    Rohan Verma
    B.Tech Computer Science and Engineering, 2025
    Skills: Java, C++, SQL, MySQL, HTML, CSS, JavaScript, Data Structures, OOPs.
    Projects:
    1. Online Library Management System using Java and MySQL.
    2. Calculator App using JavaScript.
  `;

  it('runs deterministic heuristic scan and passes strict Zod schema validation', () => {
    const result = runHeuristicAtsScan(sampleResume, 'tcs-digital', 'CSE');

    expect(result).toBeDefined();
    const parsed = AtsScanResponseSchema.safeParse(result);
    expect(parsed.success).toBe(true);
  });

  it('calculates a significant positive ATS score delta (+20% to +45%)', () => {
    const result = runHeuristicAtsScan(sampleResume, 'amazon-sde', 'CSE');

    expect(result.current_ats_score).toBeGreaterThanOrEqual(38);
    expect(result.current_ats_score).toBeLessThanOrEqual(68);
    expect(result.projected_ats_score).toBeGreaterThanOrEqual(85);
    expect(result.score_delta).toBe(result.projected_ats_score - result.current_ats_score);
    expect(result.score_delta).toBeGreaterThan(15);
  });

  it('extracts recognized keywords and identifies critical missing keywords', () => {
    const result = runHeuristicAtsScan(sampleResume, 'cognizant-genc', 'CSE');

    expect(result.found_keywords.length).toBeGreaterThan(0);
    expect(result.missing_placement_keywords.length).toBeGreaterThanOrEqual(4);
    expect(result.missing_placement_keywords).toContain('Production LLM Orchestration');
  });

  it('tailors the post-workshop resume bullet and critique to the target company tier', () => {
    const companies: TargetCompany[] = [
      'tcs-digital',
      'cognizant-genc',
      'infosys-specialist',
      'amazon-sde',
      'fintech-startup',
    ];

    for (const comp of companies) {
      const result = runHeuristicAtsScan(sampleResume, comp, 'CSE');
      expect(result.company_name).toBe(TARGET_COMPANY_METADATA[comp].name);
      expect(result.target_ctc).toBe(TARGET_COMPANY_METADATA[comp].ctc);
      expect(result.post_workshop_bullet).toBeTruthy();
      expect(result.why_this_bullet_wins).toBeTruthy();
      expect(result.critical_critique).toContain(TARGET_COMPANY_METADATA[comp].name);
    }
  });
});
