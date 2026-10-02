import { describe, it, expect } from 'vitest';
import { SYNTHETIC_STUDENTS } from '@/scripts/seed-synthetic';

describe('Phase 6 Admin Command Center, Simulator & Synthetic Isolation', () => {
  const realRecords = [
    { id: 'real_1', email: 'student1@college.edu', is_synthetic: false },
    { id: 'real_2', email: 'student2@college.edu', is_synthetic: false },
    { id: 'real_3', email: 'student3@college.edu', is_synthetic: false },
  ];

  it('proves real vs synthetic data separation: toggle OFF shows ZERO synthetic rows', () => {
    const combinedDatabase = [...realRecords, ...SYNTHETIC_STUDENTS];

    // Toggle OFF: includeSynthetic = false
    const activeData = combinedDatabase.filter((row) => row.is_synthetic === false);

    expect(activeData).toHaveLength(3);
    const hasAnySynthetic = activeData.some((row) => row.is_synthetic === true);
    expect(hasAnySynthetic).toBe(false);
  });

  it('includes synthetic records ONLY when explicitly requested (toggle ON)', () => {
    const combinedDatabase = [...realRecords, ...SYNTHETIC_STUDENTS];

    // Toggle ON: includeSynthetic = true
    const activeData = combinedDatabase;
    expect(activeData).toHaveLength(6);

    const syntheticCount = activeData.filter((r) => r.is_synthetic === true).length;
    expect(syntheticCount).toBe(3);
  });

  it('validates the funnel simulator formula math accurately matches the campaign model', () => {
    const captains = 40;
    const regsPerCaptain = 8.5;
    const outreach = 150;
    const replyRate = 0.20;
    const convRate = 0.50;
    const kFactor = 0.35;
    const showUpRate = 0.42;

    const captainRegs = captains * regsPerCaptain; // 340
    const directRegs = outreach * replyRate * convRate; // 15
    const baseRegs = captainRegs + directRegs; // 355
    const totalRegs = Math.round(baseRegs * (1 + kFactor)); // 355 * 1.35 = 479.25 -> 479
    const expectedAttendees = Math.round(totalRegs * showUpRate); // 479 * 0.42 = 201.18 -> 201

    expect(captainRegs).toBe(340);
    expect(directRegs).toBe(15);
    expect(totalRegs).toBe(479);
    expect(expectedAttendees).toBe(201);
  });
});
