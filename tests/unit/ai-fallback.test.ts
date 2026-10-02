import { describe, it, expect } from 'vitest';
import {
  generateBlueprint,
  computeBlueprintCacheKey,
} from '@/lib/ai/blueprint-generator';
import { BlueprintPayloadSchema } from '@/lib/validation/blueprint-schema';

describe('AI Blueprint Fallback Chain & Resilience', () => {
  it('generates a valid blueprint with source = "static" when both API keys are removed', async () => {
    const result = await generateBlueprint('CSE', 'AI', 'beginner', {
      geminiKey: '',
      groqKey: '',
    });

    expect(result).toBeDefined();
    expect(result.source).toBe('static');
    expect(result.blueprint.project_name).toBe('Campus Placement Resume Screener AI');

    const validation = BlueprintPayloadSchema.safeParse(result.blueprint);
    expect(validation.success).toBe(true);
  });

  it('generates valid blueprints across all branches with zero external API dependencies', async () => {
    const branches = ['CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL'] as const;

    for (const branch of branches) {
      const res = await generateBlueprint(branch, 'AI', 'beginner', {
        geminiKey: '',
        groqKey: '',
      });

      expect(res.blueprint).toBeDefined();
      expect(res.blueprint.match_score).toBeGreaterThanOrEqual(60);
      expect(res.blueprint.match_score).toBeLessThanOrEqual(98);
      expect(res.blueprint.first_3_steps).toHaveLength(3);
    }
  });

  it('produces deterministic SHA256 cache keys', () => {
    const key1 = computeBlueprintCacheKey('CSE', 'AI', 'beginner');
    const key2 = computeBlueprintCacheKey('CSE', 'AI', 'beginner');
    const key3 = computeBlueprintCacheKey('IT', 'AI', 'beginner');

    expect(key1).toBe(key2);
    expect(key1).not.toBe(key3);
    expect(key1).toHaveLength(64); // SHA-256 hex length
  });

  it('serves subsequent requests from memory cache', async () => {
    // First call generates and caches
    const res1 = await generateBlueprint('ECE', 'EMBEDDED', 'beginner', {
      geminiKey: '',
      groqKey: '',
    });

    // Second call should retrieve from cache
    const res2 = await generateBlueprint('ECE', 'EMBEDDED', 'beginner', {
      geminiKey: '',
      groqKey: '',
    });

    expect(res2.source).toBe('cache');
    expect(res2.blueprint.project_name).toBe(res1.blueprint.project_name);
  });
});
