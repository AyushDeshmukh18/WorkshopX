import { describe, it, expect } from 'vitest';
import { STATIC_BLUEPRINTS, getStaticBlueprint } from '@/lib/ai/static-blueprints';
import {
  BlueprintPayloadSchema,
  BranchEnum,
  InterestEnum,
  SkillLevelEnum,
  type Branch,
  type Interest,
  type SkillLevel,
} from '@/lib/validation/blueprint-schema';

describe('Static Blueprint Library (Offline Fallback Engine)', () => {
  it('contains at least 40 high-quality placement blueprints', () => {
    expect(STATIC_BLUEPRINTS.length).toBeGreaterThanOrEqual(40);
  });

  it('validates every single blueprint entry against the strict Zod schema', () => {
    for (const entry of STATIC_BLUEPRINTS) {
      const result = BlueprintPayloadSchema.safeParse(entry.blueprint);
      if (!result.success) {
        throw new Error(
          `Blueprint "${entry.blueprint.project_name}" failed validation: ${JSON.stringify(
            result.error.issues
          )}`
        );
      }
      expect(result.success).toBe(true);
      expect(entry.blueprint.match_score).toBeGreaterThanOrEqual(60);
      expect(entry.blueprint.match_score).toBeLessThanOrEqual(98);
      expect(entry.blueprint.first_3_steps).toHaveLength(3);
      expect(entry.blueprint.stack.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('covers the entire branch x interest matrix', () => {
    const branches = BranchEnum.options;
    const interests = InterestEnum.options;

    for (const branch of branches) {
      for (const interest of interests) {
        const match = STATIC_BLUEPRINTS.some(
          (b) => b.branch === branch && b.interest === interest
        );
        expect(
          match,
          `Matrix cell missing: branch=${branch}, interest=${interest}`
        ).toBe(true);
      }
    }
  });

  it('retrieves a valid fallback blueprint for any combination of branch, interest, and level', () => {
    const branches = BranchEnum.options;
    const interests = InterestEnum.options;
    const levels = SkillLevelEnum.options;

    for (const b of branches) {
      for (const i of interests) {
        for (const l of levels) {
          const bp = getStaticBlueprint(b as Branch, i as Interest, l as SkillLevel);
          expect(bp).toBeDefined();
          expect(bp.project_name.length).toBeGreaterThan(0);
          expect(bp.match_score).toBeGreaterThanOrEqual(60);
          expect(bp.match_score).toBeLessThanOrEqual(98);
          expect(bp.first_3_steps).toHaveLength(3);
        }
      }
    }
  });
});
